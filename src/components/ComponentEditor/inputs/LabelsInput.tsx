import {
  Button,
  FieldSet,
  InlineField,
  InlineFieldRow,
  Input,
} from "@grafana/ui";
import { Control, useFieldArray } from "react-hook-form";

const LabelsInput = ({
  control,
  name,
}: {
  control: Control<Record<string, any>>;
  name: string;
}) => {
  const { fields, append, remove } = useFieldArray({
    name: `${name}` as const,
  });
  return (
    <FieldSet label={<h5>Labels</h5>}>
      {(fields as Array<Record<string, any>>).map((field, index) => (
        <InlineFieldRow key={field.id}>
          <InlineField label="Key">
            <Input
              defaultValue={field["key"]}
              {...control.register(`${name}[${index}].key` as const)}
            />
          </InlineField>
          <InlineField label="Value">
            <Input
              defaultValue={field["value"]}
              {...control.register(`${name}[${index}].value` as const)}
            />
          </InlineField>
          <Button
            fill="outline"
            variant="secondary"
            icon="trash-alt"
            tooltip="Delete this label"
            onClick={(e) => {
              remove(index);
              e.preventDefault();
            }}
          />
        </InlineFieldRow>
      ))}
      <Button onClick={() => append({})} icon="plus" variant="secondary">
        Add
      </Button>
    </FieldSet>
  );
};

export default LabelsInput;
