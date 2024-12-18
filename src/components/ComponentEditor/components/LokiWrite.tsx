import {
  Input,
  Alert,
  LinkButton,
  FieldSet,
  ControlledCollapse,
  InlineField,
  InlineSwitch,
} from "@grafana/ui";
import { useFormContext } from "react-hook-form";
import AuthenticationEditor from "../common/AuthenticationEditor";
import TlsConfig from "../common/TlsConfig";
import MultiBlock from "../inputs/MultiBlock";
import TypedInput from "../inputs/TypedInput";

const Component = () => {
  const commonOptions = {
    labelWidth: 24,
  };
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <>
      <Alert severity="info" title="Connection Information">
        To view your connection information, navigate to{" "}
        <LinkButton
          href="https://grafana.com/profile/org"
          fill="text"
          icon="external-link-alt"
          target="_blank"
        >
          your cloud console
        </LinkButton>
      </Alert>
      <MultiBlock
        name="endpoint"
        title="Endpoints"
        newBlock={{
          enable_http2: true,
          follow_redirects: true,
        }}
      >
        {(field, index) => {
          return (
            <FieldSet label="Endpoint">
              <InlineField
                label="Endpoint URL"
                tooltip="Where to send metrics to"
                error="An endpoint URL is required"
                invalid={!!errors["endpoint"]?.url}
                {...commonOptions}
              >
                <TypedInput
                  name={`endpoint[${index}].url` as const}
                  control={control}
                  defaultValue={field["url"]}
                />
              </InlineField>
              <AuthenticationEditor.Component
                parent={`endpoint[${index}]` as const}
                defaultValue={field.auth_type}
              />
              <FieldSet label="Advanced settings">
                <InlineField
                  label="Tenant ID"
                  tooltip="The tenant ID used by default to push logs. This is not required when using Grafana Cloud"
                  {...commonOptions}
                >
                  <TypedInput
                    name={`endpoint[${index}].tenant_id` as const}
                    control={control}
                    defaultValue={field["tenant_id"]}
                  />
                </InlineField>
                <ControlledCollapse label="Queue Configuration">
                  <InlineField
                    label="Batch wait duration"
                    tooltip="Maximum amount of time to wait before sending a batch."
                    {...commonOptions}
                  >
                    <TypedInput
                      name={`endpoint[${index}].batch_wait` as const}
                      control={control}
                      defaultValue={field["batch_wait"]}
                    />
                  </InlineField>
                  <InlineField
                    label="Batch size"
                    tooltip="	Maximum batch size of logs to accumulate before sending."
                    {...commonOptions}
                  >
                    <TypedInput
                      name={`endpoint[${index}].batch_size` as const}
                      control={control}
                      defaultValue={field["batch_size"]}
                    />
                  </InlineField>
                  <InlineField
                    label="Minimum backoff"
                    tooltip="Initial retry delay. The backoff time gets doubled for each retry."
                    {...commonOptions}
                  >
                    <TypedInput
                      name={`endpoint[${index}].min_backoff_period` as const}
                      control={control}
                      defaultValue={field?.min_backoff_period}
                    />
                  </InlineField>
                  <InlineField
                    label="Maximum backoff"
                    tooltip="Maximum retry delay."
                    {...commonOptions}
                  >
                    <TypedInput
                      name={`endpoint[${index}].max_backoff_period` as const}
                      control={control}
                      defaultValue={field?.max_backoff_period}
                    />
                  </InlineField>
                  <InlineField
                    label="Maximum backoff retries"
                    tooltip="Maximum number of retries."
                    {...commonOptions}
                  >
                    <Input
                      {...register(
                        `endpoint[${index}].max_backoff_retries` as const,
                        { valueAsNumber: true },
                      )}
                      defaultValue={field?.max_backoff_retries}
                    />
                  </InlineField>
                </ControlledCollapse>
                <ControlledCollapse label="TLS Configuration">
                  <TlsConfig
                    parent={`endpoint[${index}].tls_config` as const}
                    defaultValues={field?.tls_config}
                  />
                </ControlledCollapse>
                <ControlledCollapse label="Connection settings">
                  <InlineField
                    label="Proxy URL"
                    tooltip="HTTP proxy to proxy requests through."
                    {...commonOptions}
                  >
                    <TypedInput
                      name={`endpoint[${index}].proxy_url` as const}
                      control={control}
                      defaultValue={field["proxy_url"]}
                    />
                  </InlineField>
                  <InlineField
                    label="Remote timeout"
                    tooltip="Timeout for requests made to the URL."
                    {...commonOptions}
                  >
                    <TypedInput
                      name={`endpoint[${index}].remote_timeout` as const}
                      control={control}
                      defaultValue={field["remote_timeout"]}
                    />
                  </InlineField>
                  <InlineField
                    label="Follow redirects"
                    tooltip="Whether redirects returned by the server should be followed."
                    {...commonOptions}
                  >
                    <InlineSwitch
                      {...register(
                        `endpoint[${index}].follow_redirects` as const,
                      )}
                      defaultChecked={field["follow_redirects"]}
                    />
                  </InlineField>
                  <InlineField
                    label="Enable HTTP2"
                    tooltip="Whether HTTP2 is supported for requests."
                    {...commonOptions}
                  >
                    <InlineSwitch
                      {...register(`endpoint[${index}].enable_http2` as const)}
                      defaultChecked={field["enable_http2"]}
                    />
                  </InlineField>
                </ControlledCollapse>
              </FieldSet>
            </FieldSet>
          );
        }}
      </MultiBlock>
    </>
  );
};

const LokiWrite = {
  Component,
  preTransform(data: Record<string, any>): Record<string, any> {
    data.endpoint = data.endpoint.map((ep: Record<string, any>) => {
      return AuthenticationEditor.preTransform(ep);
    });
    return data;
  },
  postTransform(data: Record<string, any>): Record<string, any> {
    data.endpoint = data.endpoint.map((ep: Record<string, any>) => {
      return AuthenticationEditor.postTransform(ep);
    });
    return data;
  },
};

export default LokiWrite;
