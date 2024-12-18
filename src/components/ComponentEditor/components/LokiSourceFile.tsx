import { InlineField } from "@grafana/ui";
import ReferenceSelect from "../inputs/ReferenceSelect";
import ReferenceMultiSelect from "../inputs/ReferenceMultiSelect";
import { useFormContext } from "react-hook-form";

const Component = () => {
  const {
    formState: { errors },
    control,
  } = useFormContext();
  return (
    <>
      <InlineField
        label="Targets"
        tooltip="List of files to read from."
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
      <InlineField
        label="Forward to"
        tooltip="List of receivers to send log entries to."
        labelWidth={14}
        error="You must specify the destination"
        invalid={!!errors["forward_to"]}
      >
        <ReferenceMultiSelect
          name="forward_to"
          exportName="LokiReceiver"
          control={control}
        />
      </InlineField>
    </>
  );
};

const LokiSourceFile = {
  preTransform(data: Record<string, any>): Record<string, any> {
    return data;
  },
  postTransform(data: Record<string, any>): Record<string, any> {
    return data;
  },
  Component,
};
export default LokiSourceFile;
