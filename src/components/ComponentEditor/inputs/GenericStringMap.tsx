import {
  Button,
  FieldSet,
  InlineField,
  InlineFieldRow,
  Input,
} from "@grafana/ui";
import { Control, useFieldArray } from "react-hook-form";

const GenericStringMap = ({
  control,
  name,
  title,
}: {
  control: Control<Record<string, any>>;
  name: string;
  title: string;
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `${name}` as const,
  });

  return (
    <FieldSet label={<h5>{title}</h5>}>
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
            tooltip="Delete this entry"
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

export default GenericStringMap;
