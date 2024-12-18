import { Alert, InlineField, VerticalGroup } from "@grafana/ui";
import { useFormContext } from "react-hook-form";
import TypedInput from "../../inputs/TypedInput";

const Component = () => {
  const commonOptions = {
    labelWidth: 25,
  };
  const {
    control,
    formState: { errors },
  } = useFormContext();
  return (
    <>
      <VerticalGroup>
        <InlineField
          label="Stack name"
          tooltip="Name of your stack as shown in the Grafana Cloud Console"
          error="The stack name is required"
          invalid={!!errors["arguments"]?.stack_name}
          {...commonOptions}
        >
          <TypedInput
            name="stack_name"
            control={control}
            rules={{ required: true }}
          />
        </InlineField>
        <InlineField
          label="Token"
          tooltip="Access policy token or API Key"
          error="The token is required"
          invalid={!!errors["arguments"]?.token}
          {...commonOptions}
        >
          <TypedInput
            name="token"
            control={control}
            rules={{ required: true }}
          />
        </InlineField>

        <Alert severity="info" title="Creating the token">
          To retrieve the token, go to the <i>Access Policies</i> section in the{" "}
          <a
            href="https://grafana.com/profile/org"
            target="_blank"
            rel="noreferrer"
          >
            Grafana Cloud console
          </a>{" "}
          and create a new Access policy. In addition to the scopes you are
          planning to use (e.g. writing metrics/logs/traces), you will need to
          add the <code>stacks:read</code> scope using the dropdown menu.
          Afterwards, create a new token for this access policy and use it here.
        </Alert>
      </VerticalGroup>
    </>
  );
};

const GrafanaCloudAutoconfigure = {
  preTransform(data: Record<string, any>): Record<string, any> {
    return data;
  },
  postTransform(data: Record<string, any>): Record<string, any> {
    return data;
  },
  Component,
};

export default GrafanaCloudAutoconfigure;
