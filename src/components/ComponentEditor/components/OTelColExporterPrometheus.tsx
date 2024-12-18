import { InlineField, InlineSwitch, Input, VerticalGroup } from "@grafana/ui";
import { useFormContext } from "react-hook-form";
import ReferenceMultiSelect from "../inputs/ReferenceMultiSelect";

const Component = () => {
  const commonOptions = {
    labelWidth: 25,
  };
  const { control, register } = useFormContext();
  return (
    <>
      <VerticalGroup>
        <InlineField label="Forward to" {...commonOptions}>
          <ReferenceMultiSelect
            control={control}
            name="forward_to"
            exportName="PrometheusReceiver"
          />
        </InlineField>
        <InlineField
          label="Include target info"
          tooltip="Whether to include target_info metrics."
          {...commonOptions}
        >
          <InlineSwitch {...register("include_target_info")} />
        </InlineField>
        <InlineField
          label="Include scope"
          tooltip="Whether to include otel_scope_info metrics."
          {...commonOptions}
        >
          <InlineSwitch {...register("include_scope_info")} />
        </InlineField>
        <InlineField
          label="GC Frequency"
          tooltip="How often to clean up stale metrics from memory."
          {...commonOptions}
        >
          <Input placeholder="5m" {...register("gc_frequency")} />
        </InlineField>
      </VerticalGroup>
    </>
  );
};

const OTelColExporterPrometheus = {
  preTransform(data: Record<string, any>): Record<string, any> {
    return data;
  },
  postTransform(data: Record<string, any>): Record<string, any> {
    return data;
  },
  Component,
};

export default OTelColExporterPrometheus;
