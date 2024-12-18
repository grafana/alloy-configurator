import { InlineField, Input, MultiSelect, VerticalGroup } from "@grafana/ui";
import { Controller, useFormContext } from "react-hook-form";

const PrometheusExporterGithub = () => {
  const commonOptions = {
    labelWidth: 14,
  };
  const { register, control } = useFormContext();
  return (
    <VerticalGroup>
      <InlineField
        label="api_token"
        tooltip="API token to use to authenticate against GitHub."
        {...commonOptions}
      >
        <Input {...register("api_token")} />
      </InlineField>
      <InlineField
        label="api_token_file"
        tooltip="File containing API token to use to authenticate against GitHub."
        {...commonOptions}
      >
        <Input {...register("api_token_file")} />
      </InlineField>
      <InlineField
        label="api_token_file"
        tooltip="File containing API token to use to authenticate against GitHub. Takes precedence over api_token"
        {...commonOptions}
      >
        <Input {...register("api_token_file")} />
      </InlineField>
      {["organizations", "users", "repositories"].map((type) => {
        return (
          <InlineField label={type} key={type} {...commonOptions}>
            <Controller
              render={({ field: { onChange, ...field } }) => (
                <MultiSelect
                  {...field}
                  onChange={(v) => onChange(v.map((x) => x.value))}
                  options={[]}
                  allowCustomValue
                  placeholder={`Enter ${type}`}
                  width={26}
                />
              )}
              defaultValue={[]}
              control={control}
              name={type}
            />
          </InlineField>
        );
      })}
      <p>
        GitHub uses an aggressive rate limit for unauthenticated requests based
        on IP address. To allow more API requests, it is recommended to
        configure either <code>api_token</code> or <code>api_token_file</code>{" "}
        to authenticate against GitHub.
      </p>
    </VerticalGroup>
  );
};

export default PrometheusExporterGithub;
