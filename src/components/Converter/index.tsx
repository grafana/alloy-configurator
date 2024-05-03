import {
  Alert,
  AlertVariant,
  Button,
  Field,
  FieldSet,
  Modal,
  Select,
  Spinner,
  TextArea,
} from "@grafana/ui";
import { css } from "@emotion/css";
import { useModelContext } from "../../state";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useMemo, useState } from "react";

type InputType =
  | "otelcol"
  | "promtail"
  | "static"
  | "prometheus"
  | "static integrations-next";

interface Diagnostic {
  Severity: number;
  Summary: string;
  Detail: string;
}

interface ConversionRequest {
  data: string;
  type: InputType;
}
interface ConversionResponse {
  data?: string;
  diagnostics: Diagnostic[];
}

const severities: AlertVariant[] = [
  "info",
  "info",
  "warning",
  "error",
  "error",
];

const convertConfig = async (
  r: ConversionRequest,
): Promise<ConversionResponse> => {
  const resp = await fetch(process.env.REACT_APP_CONVERT_ENDPOINT as string, {
    method: "POST",
    body: JSON.stringify(r),
  });
  if (resp.status !== 200) {
    return {
      diagnostics: [
        {
          Severity: 4,
          Summary: "failed to convert: " + (await resp.text()),
          Detail: "",
        },
      ],
    };
  }
  const rj = await resp.json();
  return rj;
};

const Converter = ({ dismiss }: { dismiss: () => void }) => {
  const { setModel } = useModelContext();

  const [loading, setLoading] = useState(false);

  const [diags, setDiags] = useState<Diagnostic[]>([]);
  const hasDiagnostics = useMemo(() => {
    return diags.length > 0;
  }, [diags]);
  const [converted, setConverted] = useState<string | null>(null);

  const defaultValues = {
    data: "",
    type: "static" as InputType,
  };

  const formAPI = useForm<ConversionRequest>({
    mode: "onSubmit",
    defaultValues: defaultValues,
    shouldFocusError: true,
  });
  const { register, control, handleSubmit } = formAPI;

  const submit = async (values: ConversionRequest) => {
    setLoading(true);
    try {
      const resp = await convertConfig(values);
      setDiags(resp.diagnostics);
      if (resp.data) setConverted(resp.data);
    } catch (ex) {
      setDiags([{ Severity: 4, Summary: `${ex}`, Detail: "" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!hasDiagnostics && (
        <FormProvider {...formAPI}>
          <form onSubmit={(e) => e.preventDefault()}>
            <FieldSet>
              <Field label="Source Type">
                <Controller
                  control={control}
                  name="type"
                  render={({ field: { ref, ...f } }) => (
                    <Select
                      value={f.value}
                      onChange={(s) => f.onChange(s.value)}
                      options={[
                        {
                          label: "Grafana Agent Static",
                          value: "static",
                        },
                        {
                          label: "Grafana Agent Static Integrations Next",
                          value: "static integrations-next",
                        },
                        {
                          label: "OpenTelemetry Collector",
                          value: "otelcol",
                        },
                        {
                          label: "Prometheus",
                          value: "prometheus",
                        },
                        {
                          label: "Promtail",
                          value: "promtail",
                        },
                      ]}
                    />
                  )}
                  rules={{ required: true }}
                />
              </Field>
              <Field label="Source configuration">
                <TextArea rows={20} {...register("data")} />
              </Field>
            </FieldSet>
            <Modal.ButtonRow>
              <Button type="button" onClick={handleSubmit(submit)}>
                Next {loading && <Spinner />}
              </Button>
            </Modal.ButtonRow>
          </form>
        </FormProvider>
      )}
      {hasDiagnostics && (
        <>
          {diags.map((d, i) => (
            <Alert key={i} title={d.Summary} severity={severities[d.Severity]}>
              {d.Detail && (
                <p
                  className={css`
                    white-space: pre-line;
                    margin: 0;
                  `}
                >
                  {d.Detail}
                </p>
              )}
            </Alert>
          ))}
          <Modal.ButtonRow>
            <Button
              type="button"
              onClick={() => setDiags([])}
              variant="secondary"
            >
              Back
            </Button>
            {converted != null && (
              <Button
                type="button"
                onClick={() => {
                  setModel(converted);
                  dismiss();
                }}
              >
                Apply
              </Button>
            )}
          </Modal.ButtonRow>
        </>
      )}
    </>
  );
};

export default Converter;
