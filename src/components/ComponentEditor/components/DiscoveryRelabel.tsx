import { InlineField } from "@grafana/ui";
import { useFormContext } from "react-hook-form";
import { RelabelRules, transformRules } from "../common/RelabelRules";
import ReferenceSelect from "../inputs/ReferenceSelect";

const Component = () => {
  const {
    formState: { errors },
    control,
  } = useFormContext();
  return (
    <>
      <InlineField
        label="Targets"
        tooltip="Targets to relabel"
        labelWidth={22}
        error="You must specify a list of destinations"
        invalid={!!errors["targets"]}
      >
        <ReferenceSelect
          name="targets"
          exportName="list(Target)"
          control={control}
        />
      </InlineField>

      <RelabelRules />
    </>
  );
};

const DiscoveryRelabel = {
  preTransform(data: Record<string, any>): Record<string, any> {
    return data;
  },
  postTransform(data: Record<string, any>): Record<string, any> {
    return transformRules(data);
  },
  Component,
};
export default DiscoveryRelabel;
