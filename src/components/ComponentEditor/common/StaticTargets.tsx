import { css } from "@emotion/css";
import { GrafanaTheme2 } from "@grafana/data";
import { Button, FieldSet, InlineField, VerticalGroup } from "@grafana/ui";
import { Control, useFieldArray } from "react-hook-form";
import { useStyles } from "../../../theme";
import LabelsInput from "../inputs/LabelsInput";
import TypedInput from "../inputs/TypedInput";

type Target = {
  address: string;
  labels: {
    key: string;
    value: string;
  }[];
};

const Component = ({
  control,
  errors,
  parent,
}: {
  control: Control<Record<string, any>>;
  errors?: Record<string, any>;
  parent?: string;
}) => {
  const styles = useStyles(getStyles);
  parent = parent ? parent + "." : "";
  const { fields, append, remove } = useFieldArray({
    name: `${parent}static_targets` as const,
  });
  return (
    <FieldSet>
      <VerticalGroup>
        {fields.map((field, index) => (
          <div key={field.id} className={styles.targetBox}>
            <VerticalGroup>
              <InlineField
                label="Address"
                tooltip="Hostname/IP Address and port of the target to be scraped"
                labelWidth={14}
                error="An address must be defined"
                invalid={!!errors?.static_targets?.[index]?.address}
              >
                <TypedInput
                  name={`${parent}static_targets[${index}].address` as const}
                  control={control}
                  rules={{ required: true }}
                  placeholder="localhost:8080"
                />
              </InlineField>
              <LabelsInput
                control={control}
                name={`${parent}static_targets[${index}].labels`}
              />
              <Button
                fill="outline"
                variant="secondary"
                icon="trash-alt"
                tooltip="Delete this target"
                onClick={(e) => {
                  remove(index);
                  e.preventDefault();
                }}
              >
                Delete Target
              </Button>
            </VerticalGroup>
          </div>
        ))}
        <Button onClick={() => append({})} icon="plus">
          Add Target
        </Button>
      </VerticalGroup>
    </FieldSet>
  );
};

const getStyles = (theme: GrafanaTheme2) => {
  return {
    targetBox: css`
      border: 1px solid ${theme.colors.border.weak};
      padding: 1em;
      width: fit-content;
    `,
  };
};

const StaticTargets = {
  Component,
  preTransform(data: Record<string, any>) {
    const static_targets: Target[] = [];
    for (const target of data["targets"]) {
      static_targets.push({
        address: target["__address__"] as string,
        labels: Object.keys(target)
          .filter((k) => k !== "__address__")
          .map((k) => {
            return { key: k, value: target[k] };
          }),
      });
    }
    data["static_targets"] = static_targets;
    data["target_type"] = "static";
    delete data["targets"];
    return data;
  },
  postTransform(data: Record<string, any>) {
    const targets = data["static_targets"].map((target: Target) => {
      const obj: Record<string, any> = { __address__: target.address };
      for (const l of target.labels) {
        obj[l.key] = l.value;
      }
      return obj;
    });
    data["targets"] = targets;
    delete data["static_targets"];
    return data;
  },
};

export default StaticTargets;
