import { InlineField } from "@grafana/ui";
import ReferenceMultiSelect from "../inputs/ReferenceMultiSelect";
import { RelabelRules, transformRules } from "../common/RelabelRules";
import { useFormContext } from "react-hook-form";

const Component = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  return (
    <>
      <InlineField
        label="Forward to"
        tooltip="Where the metrics should be forwarded to, after relabeling takes place."
        labelWidth={22}
        error="You must specify a list of destinations"
        invalid={!!errors["targets"]}
      >
        <ReferenceMultiSelect
          name="forward_to"
          exportName="PrometheusReceiver"
          control={control}
        />
      </InlineField>
      <RelabelRules />
    </>
  );
};
const PrometheusRelabel = {
  preTransform(data: Record<string, any>): Record<string, any> {
    return data;
  },
  postTransform(data: Record<string, any>): Record<string, any> {
    return transformRules(data);
  },
  Component,
};
export default PrometheusRelabel;
