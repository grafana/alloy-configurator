import { css } from "@emotion/css";
import { GrafanaTheme2 } from "@grafana/data";
import {
  Button,
  Checkbox,
  Field,
  Input,
  LinkButton,
  Modal,
  Toggletip,
  VerticalGroup,
} from "@grafana/ui";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useStyles } from "../../../theme";
import DestinationTypePicker from "../components/destination-type/DestinationTypePicker";
import SourcesInput from "../components/SourcesInput";
import { Step } from "../components/Step";
import { WizardFormDefaults, WizardFormBasicValues } from "../types/form";

const BasicConfiguration = ({
  onSubmit,
  dismiss,
}: {
  onSubmit: (data: WizardFormBasicValues) => void;
  dismiss: () => void;
}) => {
  const formAPI = useForm<WizardFormBasicValues>({
    mode: "onSubmit",
    defaultValues: WizardFormDefaults,
    shouldFocusError: true,
  });
  const { register, control, handleSubmit, watch } = formAPI;
  const destination = watch("destination");

  const styles = useStyles(getStyles);
  return (
    <FormProvider {...formAPI}>
      <form onSubmit={(e) => e.preventDefault()} className={styles.form}>
        <Step
          title="Destination"
          stepNo={1}
          description="Where do you want to send your data?"
        >
          <Controller
            render={({ field: { ref, ...f } }) => (
              <DestinationTypePicker selected={f.value} onChange={f.onChange} />
            )}
            name="destination"
            defaultValue="cloud"
            control={control}
          />
          {destination === "cloud" && (
            <Field
              label="Stack name"
              description="The stack name can be found in you Grafana Cloud account console"
            >
              <Input placeholder="mycloudstack" {...register("stackName")} />
            </Field>
          )}
        </Step>
        <Step
          title="Telemetry"
          stepNo={2}
          description="What kind of telemetry do you want to collect?"
        >
          <VerticalGroup>
            <Checkbox
              label="Metrics"
              description="Generate or Scrape prometheus metrics"
              {...register("telemetry.metrics")}
            />
            <Checkbox
              label="Logs"
              description="Collect logs from files or external systems"
              {...register("telemetry.logs")}
            />
            <Checkbox
              label="Traces"
              description="Receive traces from instrumented applications using the OpenTelemetry protocol"
              {...register("telemetry.traces")}
            />
            <Checkbox
              label="Profiles"
              description="Collect or scrape profiling data from instrumented applications"
              {...register("telemetry.profiles")}
            />
          </VerticalGroup>
        </Step>
        <Step
          title="Sources"
          description="Which systems do you want to monitor? Select one or more!"
          stepNo={3}
        >
          <SourcesInput />
          <Toggletip
            content={
              <div>
                We're sorry to hear that. Please{" "}
                <LinkButton
                  icon="external-link-alt"
                  fill="outline"
                  size="md"
                  href="https://github.com/grafana/alloy-configurator/issues/new?assignees=&labels=enhancement%2C+wizard&projects=&template=request-wizard-source.md&title="
                  target="_blank"
                >
                  file an issue
                </LinkButton>{" "}
                describing which source you would like to see.
              </div>
            }
          >
            <Button fill="text" icon="question-circle">
              Missing a source?
            </Button>
          </Toggletip>
        </Step>
        <Modal.ButtonRow>
          <Button variant="secondary" fill="outline" onClick={dismiss}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit(onSubmit)}>
            Next
          </Button>
        </Modal.ButtonRow>
      </form>
    </FormProvider>
  );
};

const getStyles = (theme: GrafanaTheme2) => {
  return {
    form: css`
      width: 100%;
    `,
  };
};
export default BasicConfiguration;
