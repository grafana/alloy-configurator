import { InlineField, Input, VerticalGroup } from "@grafana/ui";
import { useFormContext } from "react-hook-form";
import ReferenceMultiSelect from "../inputs/ReferenceMultiSelect";

const Component = () => {
  const commonOptions = {
    labelWidth: 25,
  };
  const { register, control } = useFormContext();
  return (
    <>
      <VerticalGroup>
        <InlineField
          label="Timeout"
          tooltip="How long to wait before flushing the batch."
          {...commonOptions}
        >
          <Input {...register("timeout")} placeholder="200ms" />
        </InlineField>
        <InlineField
          label="Batch size"
          tooltip="Amount of data to buffer before flushing the batch."
          {...commonOptions}
        >
          <Input
            type="number"
            {...register("send_batch_size", { valueAsNumber: true })}
            placeholder="8192"
          />
        </InlineField>
        <InlineField
          label="Max batch size"
          tooltip="Upper limit of a batch size."
          {...commonOptions}
        >
          <Input
            type="number"
            {...register("send_batch_max_size", {
              valueAsNumber: true,
            })}
            placeholder="0"
          />
        </InlineField>
      </VerticalGroup>
      <h3 className="page-heading">Output</h3>
      <VerticalGroup>
        <InlineField label="Metrics" {...commonOptions}>
          <ReferenceMultiSelect
            control={control}
            name="output.metrics"
            exportName="otel.MetricsConsumer"
          />
        </InlineField>
        <InlineField label="Logs" {...commonOptions}>
          <ReferenceMultiSelect
            control={control}
            name="output.logs"
            exportName="otel.LogsConsumer"
          />
        </InlineField>
        <InlineField label="traces" {...commonOptions}>
          <ReferenceMultiSelect
            control={control}
            name="output.traces"
            exportName="otel.TracesConsumer"
          />
        </InlineField>
      </VerticalGroup>
    </>
  );
};

const OTelColProcessorBatch = {
  preTransform(data: Record<string, any>): Record<string, any> {
    return data;
  },
  postTransform(data: Record<string, any>): Record<string, any> {
    return data;
  },
  Component,
};

export default OTelColProcessorBatch;
