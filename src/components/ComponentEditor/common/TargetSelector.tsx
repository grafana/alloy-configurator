import { css } from "@emotion/css";
import { GrafanaTheme2 } from "@grafana/data";
import {
  FieldSet,
  InlineField,
  RadioButtonGroup,
  VerticalGroup,
} from "@grafana/ui";
import { Controller, useFormContext } from "react-hook-form";
import { useStyles } from "../../../theme";
import ReferenceSelect from "../inputs/ReferenceSelect";
import StaticTargets from "./StaticTargets";

const Component = () => {
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext();
  const watchTargetType = watch("target_type");
  const styles = useStyles(getStyles);
  return (
    <FieldSet label="Targets">
      <Controller
        name="target_type"
        control={control}
        defaultValue="reference"
        render={({ field: { ref, ...f } }) => (
          <RadioButtonGroup
            {...f}
            className={styles.targetTypeSelector}
            options={[
              {
                value: "reference",
                label: "Reference",
              },
              {
                value: "static",
                label: "Static",
              },
            ]}
          />
        )}
      />
      {watchTargetType !== "static" && (
        <VerticalGroup>
          <InlineField
            label="Targets"
            tooltip="List of targets to scrape."
            labelWidth={14}
            error="You must specify the targets parameter"
            invalid={!!errors["targets"]}
          >
            <ReferenceSelect
              name="targets"
              exportName="list(Target)"
              control={control}
            />
          </InlineField>
        </VerticalGroup>
      )}
      {watchTargetType === "static" && (
        <StaticTargets.Component control={control} errors={errors} />
      )}
    </FieldSet>
  );
};

const getStyles = (theme: GrafanaTheme2) => {
  return {
    targetTypeSelector: css`
      margin-bottom: 1em;
    `,
  };
};

const TargetSelector = {
  Component,
  preTransform(data: Record<string, any>): Record<string, any> {
    if (Array.isArray(data["targets"])) {
      data = StaticTargets.preTransform(data);
    }
    return data;
  },
  postTransform(data: Record<string, any>): Record<string, any> {
    if (data["target_type"] === "static") {
      data = StaticTargets.postTransform(data);
    }
    delete data["target_type"];
    delete data["static_targets"];
    return data;
  },
};

export default TargetSelector;
