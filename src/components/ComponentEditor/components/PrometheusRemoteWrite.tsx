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
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext();
  const commonOptions = {
    labelWidth: 24,
  };
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
          send_exemplars: true,
          remote_timeout: "30s",
          metadata_config: {
            send: true,
            send_interval: "1m",
            max_samples_per_send: 2000,
          },
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
              <InlineField
                label="Send exemplars"
                tooltip="Whether exemplars should be sent."
                {...commonOptions}
              >
                <InlineSwitch
                  {...register(`endpoint[${index}].send_exemplars` as const)}
                  defaultChecked={field["send_exemplars"]}
                />
              </InlineField>
              <InlineField
                label="Send native histograms"
                tooltip="Whether native histograms should be sent."
                {...commonOptions}
              >
                <InlineSwitch
                  {...register(
                    `endpoint[${index}].send_native_histograms` as const,
                  )}
                  defaultChecked={field["send_native_histograms"]}
                />
              </InlineField>
              <AuthenticationEditor.Component
                parent={`endpoint[${index}]` as const}
                defaultValue={field.auth_type}
              />
              <FieldSet label="Advanced settings">
                <ControlledCollapse label="TLS Configuration">
                  <TlsConfig
                    parent={`endpoint[${index}].tls_config` as const}
                    defaultValues={field?.tls_config}
                  />
                </ControlledCollapse>
                <ControlledCollapse label="Metadata">
                  <InlineField
                    label="Send metadata"
                    tooltip="Controls whether metric metadata is sent to the endpoint."
                    {...commonOptions}
                  >
                    <InlineSwitch
                      {...register(
                        `endpoint[${index}].metadata_config.send` as const,
                      )}
                      defaultChecked={field?.metadata_config?.send}
                    />
                  </InlineField>
                  <InlineField
                    label="Send interval"
                    tooltip="How frequently metric metadata is sent to the endpoint."
                    {...commonOptions}
                  >
                    <TypedInput
                      name={
                        `endpoint[${index}].metadata_config.send_interval` as const
                      }
                      control={control}
                      defaultValue={field?.metadata_config?.send_interval}
                    />
                  </InlineField>
                  <InlineField
                    label="Maximum samples per send"
                    tooltip="Maximum number of metadata samples to send to the endpoint at once."
                    {...commonOptions}
                  >
                    <Input
                      type="number"
                      {...register(
                        `endpoint[${index}].metadata_config.max_samples_per_send` as const,
                      )}
                      defaultValue={
                        field?.metadata_config?.max_samples_per_send
                      }
                    />
                  </InlineField>
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
                <ControlledCollapse label="Queue Configuration">
                  <InlineField
                    label="Capacity"
                    tooltip="Number of samples to buffer per shard."
                    {...commonOptions}
                  >
                    <Input
                      type="number"
                      {...register(
                        `endpoint[${index}].queue_config.capacity` as const,
                      )}
                      defaultValue={field?.queue_config?.capacity}
                    />
                  </InlineField>
                  <InlineField
                    label="Minimum shards"
                    tooltip="Minimum amount of concurrent shards sending samples to the endpoint."
                    {...commonOptions}
                  >
                    <Input
                      type="number"
                      {...register(
                        `endpoint[${index}].queue_config.min_shards` as const,
                      )}
                      defaultValue={field?.queue_config?.min_shards}
                    />
                  </InlineField>
                  <InlineField
                    label="Maximum shards"
                    tooltip="Maximum number of concurrent shards sending samples to the endpoint."
                    {...commonOptions}
                  >
                    <Input
                      type="number"
                      {...register(
                        `endpoint[${index}].queue_config.max_shards` as const,
                      )}
                      defaultValue={field?.queue_config?.max_shards}
                    />
                  </InlineField>
                  <InlineField
                    label="Maximum samples per send"
                    {...commonOptions}
                  >
                    <Input
                      type="number"
                      {...register(
                        `endpoint[${index}].queue_config.max_samples_per_send` as const,
                      )}
                      defaultValue={field?.queue_config?.max_samples_per_send}
                    />
                  </InlineField>
                  <InlineField
                    label="Batch send deadline"
                    tooltip="Maximum time samples will wait in the buffer before sending."
                    {...commonOptions}
                  >
                    <Input
                      {...register(
                        `endpoint[${index}].queue_config.batch_send_deadline` as const,
                      )}
                      defaultValue={field?.queue_config?.batch_send_deadline}
                    />
                  </InlineField>
                  <InlineField
                    label="Minimum backoff"
                    tooltip="Initial retry delay. The backoff time gets doubled for each retry."
                    {...commonOptions}
                  >
                    <Input
                      {...register(
                        `endpoint[${index}].queue_config.min_backoff` as const,
                      )}
                      defaultValue={field?.queue_config?.min_backoff}
                    />
                  </InlineField>
                  <InlineField
                    label="Maximum backoff"
                    tooltip="Maximum retry delay."
                    {...commonOptions}
                  >
                    <Input
                      {...register(
                        `endpoint[${index}].queue_config.max_backoff` as const,
                      )}
                      defaultValue={field?.queue_config?.max_backoff}
                    />
                  </InlineField>
                  <InlineField
                    label="Retry on HTTP 429"
                    tooltip="Retry when an HTTP 429 status code is received."
                    {...commonOptions}
                  >
                    <InlineSwitch
                      {...register(
                        `endpoint[${index}].queue_config.retry_on_http_429` as const,
                      )}
                      defaultChecked={field?.queue_config?.retry_on_http_429}
                    />
                  </InlineField>
                </ControlledCollapse>
              </FieldSet>
            </FieldSet>
          );
        }}
      </MultiBlock>
      <FieldSet label="Advanced Settings">
        <ControlledCollapse label="WAL">
          <InlineField
            label="Truncate frequency"
            tooltip="How frequently to clean up the WAL."
            {...commonOptions}
          >
            <TypedInput name="wal.truncate_frequency" control={control} />
          </InlineField>
          <InlineField
            label="Minimum keepalive time"
            tooltip="Minimum time to keep data in the WAL before it can be removed."
            {...commonOptions}
          >
            <TypedInput name="wal.min_keepalive_time" control={control} />
          </InlineField>
          <InlineField
            label="Maximum keepalive time"
            tooltip="Maximum time to keep data in the WAL before removing it."
            {...commonOptions}
          >
            <TypedInput name="wal.max_keepalive_time" control={control} />
          </InlineField>
        </ControlledCollapse>
      </FieldSet>
    </>
  );
};

const PrometheusRemoteWrite = {
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

export default PrometheusRemoteWrite;
