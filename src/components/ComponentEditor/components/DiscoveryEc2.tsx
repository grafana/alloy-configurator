import {
  Button,
  FieldSet,
  InlineField,
  InlineFieldRow,
  Input,
  MultiSelect,
} from "@grafana/ui";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";

const DiscoveryEc2 = () => {
  const { register, control } = useFormContext<{
    [key: string]: any;
    filter: Array<Record<string, any>>;
  }>();
  const commonOptions = {
    labelWidth: 14,
  };
  const { fields, append, remove } = useFieldArray({
    control,
    name: "filter",
  });

  return (
    <>
      <InlineField
        label="Region"
        tooltip="The AWS region. If blank, the region from the instance metadata is used."
        {...commonOptions}
      >
        <Input {...register("region")} placeholder="us-east-1" />
      </InlineField>
      <InlineField
        label="Port"
        tooltip="The port to scrape metrics from. If using the public IP address, this must instead be specified in the relabeling rule."
        {...commonOptions}
      >
        <Input
          type="number"
          {...register("port", { valueAsNumber: true })}
          placeholder="80"
        />
      </InlineField>
      <InlineField
        label="Access Key"
        tooltip="The AWS API key ID. If blank, the environment variable AWS_ACCESS_KEY_ID is used."
        {...commonOptions}
      >
        <Input {...register("access_key")} />
      </InlineField>
      <InlineField
        label="Secret Key"
        tooltip="The AWS API key ID. If blank, the environment variable AWS_SECRET_ACCESS_KEY is used."
        {...commonOptions}
      >
        <Input {...register("secret_key")} />
      </InlineField>
      <InlineField
        label="Profile"
        tooltip="Named AWS profile used to connect to the API."
        {...commonOptions}
      >
        <Input {...register("profile")} />
      </InlineField>
      <InlineField
        label="Role ARN"
        tooltip="AWS Role Amazon Resource Name (ARN), an alternative to using AWS API keys."
        {...commonOptions}
      >
        <Input {...register("role_arn")} />
      </InlineField>

      <FieldSet label="Filters">
        {fields.map((field, index) => (
          <InlineFieldRow key={field.id}>
            <InlineField
              label="Filter name"
              tooltip="Filter name to use."
              {...commonOptions}
            >
              <Input
                defaultValue={field["name"]}
                {...register(`filter[${index}].name` as const)}
              />
            </InlineField>
            <InlineField
              label="Values"
              tooltip="Values to pass to the filter."
              {...commonOptions}
            >
              <Controller
                render={({ field: { onChange, ref, ...field } }) => (
                  <MultiSelect
                    {...field}
                    onChange={(v) => onChange(v.map((x) => x.value))}
                    options={[]}
                    allowCustomValue
                    placeholder="Filter Values"
                  />
                )}
                defaultValue={field["values"]}
                control={control}
                name={`filter[${index}].values` as const}
              />
            </InlineField>
            <Button
              fill="outline"
              variant="secondary"
              icon="trash-alt"
              tooltip="Delete this filter"
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

export default DiscoveryEc2;
