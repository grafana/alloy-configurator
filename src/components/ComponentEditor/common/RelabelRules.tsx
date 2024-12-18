import { css } from "@emotion/css";
import { GrafanaTheme2, SelectableValue } from "@grafana/data";
import {
  Button,
  FieldSet,
  InlineField,
  Input,
  MultiSelect,
  Select,
  VerticalGroup,
} from "@grafana/ui";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";

import { useStyles } from "../../../theme";

const relabelActions = [
  {
    value: "replace",
    label: "replace",
    description:
      "Matches regex to the concatenated labels. If there's a match, it replaces the content of the target_label using the contents of the replacement field",
  },
  {
    value: "keep",
    label: "keep",
    description:
      "Keeps logs where regex matches the string extracted using the source_labels and separator",
  },
  {
    value: "drop",
    label: "drop",
    description:
      "Drops logs where regex matches the string extracted using the source_labels and separator",
  },
  {
    value: "hashmod",
    label: "hashmod",
    description:
      "Hashes the concatenated labels, calculates its modulo modulus and writes the result to the target_label",
  },
  {
    value: "labelmap",
    label: "labelmap",
    description:
      "Matches regex against all label names. Any labels that match are renamed according to the contents of the replacement field",
  },
  {
    value: "labeldrop",
    label: "labeldrop",
    description:
      "Matches regex against all label names. Any labels that match are removed from the logs’s label set",
  },
  {
    value: "labelkeep",
    label: "labelkeep",
    description:
      "Matches regex against all label names. Any labels that don’t match are removed from the logs’s label set",
  },
  {
    value: "keepequal",
    label: "keepequal",
    description:
      "Drop targets for which the concatenated source_labels do not match target_label",
  },
  {
    value: "dropequal",
    label: "dropequal",
    description:
      "Drop targets for which the concatenated source_labels do match target_label",
  },
  {
    value: "lowercase",
    label: "lowercase",
    description:
      "Sets target_label to the lowercase form of the concatenated source_labels",
  },
  {
    value: "uppercase",
    label: "uppercase",
    description:
      "Sets target_label to the uppercase form of the concatenated source_labels",
  },
];

export const RelabelRules = () => {
  const { control, register } = useFormContext<{
    [key: string]: any;
    rule: Array<Record<string, any>>;
  }>();
  const styles = useStyles(getStyles);
  const commonOptions = { labelWidth: 24 };

  const { fields, append, remove } = useFieldArray({
    control,
    name: "rule",
  });
  return (
    <FieldSet label="Rules">
      {fields.map((field, index) => (
        <div key={field.id} className={styles.ruleBox}>
          <VerticalGroup className={styles.ruleBox}>
            <InlineField
              label="Source labels"
              tooltip="The list of labels whose values are to be selected. Their content is concatenated using the separator and matched against regex"
              {...commonOptions}
            >
              <Controller
                defaultValue={field["source_labels"] || []}
                name={`rule[${index}].source_labels` as const}
                control={control}
                render={({ field: { ref, ...f } }) => (
                  <MultiSelect
                    placeholder="Enter to add"
                    allowCustomValue={true}
                    {...f}
                  />
                )}
              />
            </InlineField>
            <InlineField
              label="Target label"
              tooltip="Label to which the resulting value will be written to."
              {...commonOptions}
            >
              <Input
                defaultValue={field["target_label"]}
                {...register(`rule[${index}].target_label` as const)}
              />
            </InlineField>
            <InlineField
              label="Separator"
              tooltip="The separator used to concatenate the values present in source_labels."
              {...commonOptions}
            >
              <Input
                defaultValue={field["separator"]}
                placeholder=";"
                {...register(`rule[${index}].separator` as const)}
              />
            </InlineField>
            <InlineField
              label="RegEx"
              tooltip="A valid RE2 expression with support for parenthesized capture groups. Used to match the extracted value from the combination of the source_label and separator fields or filter labels during the labelkeep/labeldrop/labelmap actions."
              {...commonOptions}
            >
              <Input
                defaultValue={field["regex"]}
                placeholder="(.*)"
                {...register(`rule[${index}].regex` as const)}
              />
            </InlineField>
            <InlineField
              label="Modulus"
              tooltip="A positive integer used to calculate the modulus of the hashed source label values."
              {...commonOptions}
            >
              <Input
                defaultValue={field["modulus"] || ""}
                type="number"
                {...register(`rule[${index}].modulus` as const, {
                  valueAsNumber: true,
                })}
              />
            </InlineField>
            <InlineField
              label="Replacement"
              tooltip="The value against which a regex replace is performed, if the regex matches the extracted value. Supports previously captured groups."
              {...commonOptions}
            >
              <Input
                defaultValue={field["replacement"]}
                placeholder="$1"
                {...register(`rule[${index}].replacement` as const)}
              />
            </InlineField>
            <InlineField
              label="Action"
              tooltip="The relabeling action to perform."
              {...commonOptions}
            >
              <Controller
                name={`rule[${index}].action` as const}
                control={control}
                defaultValue={field["action"] || "replace"}
                render={({ field: { ref, ...f } }) => (
                  <Select
                    {...f}
                    placeholder="replace"
                    options={relabelActions}
                    width={24}
                  />
                )}
              />
            </InlineField>
            <Button
              fill="outline"
              variant="secondary"
              icon="trash-alt"
              tooltip="Delete this rule"
              onClick={(e) => {
                remove(index);
                e.preventDefault();
              }}
            >
              Delete Rule
            </Button>
          </VerticalGroup>
        </div>
      ))}
      <Button onClick={() => append({})} icon="plus">
        Add
      </Button>
    </FieldSet>
  );
};

const getStyles = (theme: GrafanaTheme2) => {
  return {
    ruleBox: css`
      border: 1px solid ${theme.colors.border.weak};
      padding: 1em;
      width: fit-content;
    `,
  };
};

export function transformRules(data: Record<string, any>): Record<string, any> {
  data.rule = data.rule.map((rule: Record<string, any>) => {
    if (
      Array.isArray(rule["source_labels"]) &&
      typeof rule["source_labels"][0] === "object"
    ) {
      rule["source_labels"] = rule["source_labels"]?.map(
        (x: SelectableValue) => x.value,
      );
    }
    if (typeof rule["action"] === "object")
      rule["action"] = rule["action"].value;
    return rule;
  });
  return data;
}
