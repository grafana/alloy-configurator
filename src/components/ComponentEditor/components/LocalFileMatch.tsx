import {
  Button,
  FieldSet,
  InlineField,
  InlineFieldRow,
  Input,
} from "@grafana/ui";
import { useFieldArray, useFormContext } from "react-hook-form";

const Component = () => {
  const commonOptions = {
    labelWidth: 14,
  };
  const { control, register } = useFormContext<{
    [key: string]: any;
    path_targets: Array<Record<string, any>>;
  }>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "path_targets",
  });
  return (
    <>
      <InlineField
        label="Sync period"
        tooltip="How often to sync filesystem and targets"
        {...commonOptions}
      >
        <Input {...register("sync_period")} placeholder="10s" />
      </InlineField>
      <FieldSet label="Path Targets">
        {fields.map((field, index) => (
          <InlineFieldRow key={field.id}>
            <InlineField
              label="Include"
              tooltip="Target to expand."
              {...commonOptions}
            >
              <Input
                defaultValue={field["__path__"]}
                {...register(`path_targets[${index}].__path__` as const)}
              />
            </InlineField>
            <InlineField
              label="Exclude"
              tooltip="Exclude files matching this pattern"
              {...commonOptions}
            >
              <Input
                defaultValue={field["__path_exclude__"]}
                {...register(
                  `path_targets[${index}].__path_exclude__` as const,
                )}
              />
            </InlineField>
            <Button
              fill="outline"
              variant="secondary"
              icon="trash-alt"
              tooltip="Delete this pattern"
              onClick={(e) => {
                remove(index);
                e.preventDefault();
              }}
            />
          </InlineFieldRow>
        ))}
        <Button onClick={() => append({})} icon="plus">
          Add
        </Button>
      </FieldSet>
    </>
  );
};

const LocalFileMatch = {
  preTransform(data: Record<string, any>): Record<string, any> {
    return data;
  },
  postTransform(data: Record<string, any>): Record<string, any> {
    if (!data["path_targets"]) data["path_targets"] = [];
    data["path_targets"] = data["path_targets"].map(
      (target: Record<string, string>) => {
        if (target["__path_exclude__"] === "")
          delete target["__path_exclude__"];
        return target;
      },
    );
    return data;
  },
  Component,
};

export default LocalFileMatch;
