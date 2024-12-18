import { FieldSet, InlineField, InlineSwitch } from "@grafana/ui";
import ReferenceSelect from "../inputs/ReferenceSelect";
import ReferenceMultiSelect from "../inputs/ReferenceMultiSelect";
import TypedInput from "../inputs/TypedInput";
import LabelsInput from "../inputs/LabelsInput";
import { useFormContext } from "react-hook-form";

const Component = () => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext();
  const commonOptions = { labelWidth: 24 };
  return (
    <>
      <InlineField
        label="Format as JSON"
        tooltip="Whether to forward the original journal entry as JSON."
        {...commonOptions}
      >
        <InlineSwitch {...register("format_as_json")} />
      </InlineField>
      <InlineField
        label="Max age"
        tooltip="The oldest relative time from process start that will be read."
        {...commonOptions}
      >
        <TypedInput name="max_age" control={control} placeholder="7h" />
      </InlineField>
      <InlineField
        label="Path"
        tooltip="Path to a directory to read entries from."
        {...commonOptions}
      >
        <TypedInput
          name="path"
          control={control}
          placeholder="/var/log/journal"
        />
      </InlineField>
      <InlineField
        label="Matches"
        tooltip="Journal matches to filter. The + character is not supported, only logical AND matches will be added."
        {...commonOptions}
      >
        <TypedInput name="matches" control={control} />
      </InlineField>
      <InlineField
        label="Relabel Rules"
        tooltip="Relabeling rules to apply on log entries."
        {...commonOptions}
      >
        <ReferenceSelect
          name="relabel_rules"
          exportName="RelabelRules"
          control={control}
          width={27}
        />
      </InlineField>
      <InlineField
        label="Forward to"
        tooltip="List of receivers to send log entries to."
        {...commonOptions}
        error="You must specify the destination"
        invalid={!!errors["forward_to"]}
      >
        <ReferenceMultiSelect
          name="forward_to"
          exportName="LokiReceiver"
          control={control}
          rules={{ required: true }}
          width={27}
        />
      </InlineField>
      <FieldSet label="Labels">
        <LabelsInput name="labels_array" control={control} />
      </FieldSet>
    </>
  );
};

const LokiSourceJournal = {
  preTransform(data: Record<string, any>): Record<string, any> {
    const existingLabels: Record<string, string>[] = [];
    for (const k of Object.keys(data["labels"] || {})) {
      existingLabels.push({ key: k, value: data["labels"][k] });
    }
    data["labels_array"] = existingLabels;
    delete data["labels"];
    return data;
  },
  postTransform(data: Record<string, any>): Record<string, any> {
    const newLabels: Record<string, string> = {};
    for (const l of data["labels_array"]) {
      newLabels[l.key] = l.value;
    }
    data["labels"] = newLabels;
    delete data["labels_array"];
    return data;
  },
  Component,
};
export default LokiSourceJournal;
