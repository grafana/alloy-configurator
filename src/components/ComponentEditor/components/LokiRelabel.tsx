import { InlineField, Input } from "@grafana/ui";
import ReferenceMultiSelect from "../inputs/ReferenceMultiSelect";
import { RelabelRules, transformRules } from "../common/RelabelRules";
import { useFormContext } from "react-hook-form";

const Component = () => {
  const {
    formState: { errors },
    control,
    register,
  } = useFormContext();
  return (
    <>
      <InlineField
        label="Forward to"
        tooltip="Where to forward log entries after relabeling."
        labelWidth={22}
        error="You must specify a list of destinations"
        invalid={!!errors["targets"]}
      >
        <ReferenceMultiSelect
          name="forward_to"
          exportName="LokiReceiver"
          control={control}
        />
      </InlineField>
      <InlineField
        label="Max cache size"
        tooltip="The maximum number of elements to hold in the relabeling cache."
        labelWidth={22}
      >
        <Input type="number" {...register("max_cache_size")} />
      </InlineField>
      <RelabelRules />
    </>
  );
};

const LokiRelabel = {
  preTransform(data: Record<string, any>): Record<string, any> {
    return data;
  },
  postTransform(data: Record<string, any>): Record<string, any> {
    return transformRules(data);
  },
  Component,
};
export default LokiRelabel;
