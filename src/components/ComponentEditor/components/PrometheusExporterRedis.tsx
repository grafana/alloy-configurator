import { InlineField, InlineSwitch, Input, MultiSelect } from "@grafana/ui";
import { Controller, useFormContext } from "react-hook-form";

const PrometheusExporterRedis = () => {
  const commonOptions = {
    labelWidth: 26,
  };
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();
  return (
    <>
      <InlineField
        label="Redis Address"
        tooltip="Address (host and port) of the Redis instance to connect to."
        error="The redis address is required"
        invalid={!!errors["redis_addr"]}
        {...commonOptions}
      >
        <Input
          {...register("redis_addr", { required: true })}
          placeholder="localhost:6379"
        />
      </InlineField>
      <InlineField
        label="Redis User"
        tooltip="User name to use for authentication (Redis ACL for Redis 6.0 and newer)."
        {...commonOptions}
      >
        <Input {...register("redis_user")} />
      </InlineField>
      <InlineField
        label="Redis password"
        tooltip="Password of the Redis instance."
        {...commonOptions}
      >
        <Input {...register("redis_password")} />
      </InlineField>
      <InlineField
        label="Redis password file"
        tooltip="Path of a file containing a password."
        {...commonOptions}
      >
        <Input {...register("redis_password_file")} />
      </InlineField>
      <InlineField
        label="Connection timeout"
        tooltip="Timeout for connection to Redis instance (in Golang duration format)."
        {...commonOptions}
      >
        <Input {...register("connection_timeout")} placeholder="15s" />
      </InlineField>
      <InlineField
        label="Cluster"
        tooltip="Whether the connection is to a Redis cluster."
        {...commonOptions}
      >
        <InlineSwitch {...register("is_cluster")} />
      </InlineField>
      <h6>Advanced Options</h6>
      <InlineField
        label="Redis password map file"
        tooltip="Path of a JSON file containing a map of Redis URIs to passwords."
        {...commonOptions}
      >
        <Input {...register("redis_password_map_file")} />
      </InlineField>
      <InlineField
        label="TLS client key file"
        tooltip="Name of the client key file (including full path) if the server requires TLS client authentication."
        {...commonOptions}
      >
        <Input {...register("tls_client_key_file")} />
      </InlineField>
      <InlineField
        label="TLS client cert file"
        tooltip="Name of the client certificate file (including full path) if the server requires TLS client authentication."
        {...commonOptions}
      >
        <Input {...register("tls_client_cert_file")} />
      </InlineField>
      <InlineField
        label="TLS CA cert file"
        tooltip="Name of the CA certificate file (including full path) if the server requires TLS client authentication."
        {...commonOptions}
      >
        <Input {...register("tls_ca_cert_file")} />
      </InlineField>
      <InlineField
        label="Skip tls verification"
        tooltip="Whether to to skip TLS verification."
        {...commonOptions}
      >
        <InlineSwitch {...register("skip_tls_verification")} />
      </InlineField>
      <InlineField
        label="Namespace"
        tooltip="Namespace for the metrics."
        {...commonOptions}
      >
        <Input {...register("namespace")} placeholder="redis" />
      </InlineField>
      <InlineField
        label="Config command"
        tooltip="What to use for the CONFIG command."
        {...commonOptions}
      >
        <Input {...register("config_command")} placeholder="CONFIG" />
      </InlineField>
      <InlineField
        label="Check keys"
        tooltip="List of key-patterns to export value and length/size, searched for with SCAN."
        {...commonOptions}
      >
        <Controller
          render={({ field: { onChange, ref, ...field } }) => (
            <MultiSelect
              {...field}
              onChange={(v) => onChange(v.map((x) => x.value))}
              options={[]}
              allowCustomValue
              placeholder="Add new value"
              width={26}
            />
          )}
          defaultValue={[]}
          control={control}
          name="check_keys"
        />
      </InlineField>
      <InlineField
        label="Check keys groups"
        tooltip="List of Lua regular expressions (regex) for grouping keys."
        {...commonOptions}
      >
        <Controller
          render={({ field: { onChange, ref, ...field } }) => (
            <MultiSelect
              {...field}
              onChange={(v) => onChange(v.map((x) => x.value))}
              options={[]}
              allowCustomValue
              placeholder="Add new value"
              width={26}
            />
          )}
          defaultValue={[]}
          control={control}
          name="check_keys_groups"
        />
      </InlineField>
      <InlineField
        label="Key groups batch size"
        tooltip="Check key or key groups batch size hint for the underlying SCAN."
        {...commonOptions}
      >
        <Input
          type="number"
          {...register("check_key_groups_batch_size", {
            valueAsNumber: true,
          })}
          placeholder="10000"
        />
      </InlineField>
      <InlineField
        label="Maximum distinct key groups"
        tooltip="The maximum number of distinct key groups with the most memory utilization to present as distinct metrics per database."
        {...commonOptions}
      >
        <Input
          type="number"
          {...register("max_distinct_key_groups", {
            valueAsNumber: true,
          })}
          placeholder="100"
        />
      </InlineField>
      <InlineField
        label="Check single keys"
        tooltip="List of single keys to export value and length/size."
        {...commonOptions}
      >
        <Controller
          render={({ field: { onChange, ref, ...field } }) => (
            <MultiSelect
              {...field}
              onChange={(v) => onChange(v.map((x) => x.value))}
              options={[]}
              allowCustomValue
              placeholder="Add new value"
              width={26}
            />
          )}
          defaultValue={[]}
          control={control}
          name="check_single_keys"
        />
      </InlineField>
      <InlineField
        label="Check streams"
        tooltip="List of stream-patterns to export info about streams, groups, and consumers to search for with SCAN."
        {...commonOptions}
      >
        <Controller
          render={({ field: { onChange, ref, ...field } }) => (
            <MultiSelect
              {...field}
              onChange={(v) => onChange(v.map((x) => x.value))}
              options={[]}
              allowCustomValue
              placeholder="Add new value"
              width={26}
            />
          )}
          defaultValue={[]}
          control={control}
          name="check_streams"
        />
      </InlineField>
      <InlineField
        label="Check single streams"
        tooltip="List of single streams to export info about streams, groups, and consumers."
        {...commonOptions}
      >
        <Controller
          render={({ field: { onChange, ref, ...field } }) => (
            <MultiSelect
              {...field}
              onChange={(v) => onChange(v.map((x) => x.value))}
              options={[]}
              allowCustomValue
              placeholder="Add new value"
              width={26}
            />
          )}
          defaultValue={[]}
          control={control}
          name="check_single_streams"
        />
      </InlineField>
      <InlineField
        label="Count keys"
        tooltip="List of individual keys to export counts for."
        {...commonOptions}
      >
        <Controller
          render={({ field: { onChange, ref, ...field } }) => (
            <MultiSelect
              {...field}
              onChange={(v) => onChange(v.map((x) => x.value))}
              options={[]}
              allowCustomValue
              placeholder="Add new value"
              width={26}
            />
          )}
          defaultValue={[]}
          control={control}
          name="count_keys"
        />
      </InlineField>
      <InlineField
        label="Script path"
        tooltip="Path to Lua Redis script for collecting extra metrics."
        {...commonOptions}
      >
        <Input {...register("script_path")} />
      </InlineField>
      <InlineField
        label="Script paths"
        tooltip="	List of paths to Lua Redis scripts for collecting extra metrics."
        {...commonOptions}
      >
        <Controller
          render={({ field: { onChange, ref, ...field } }) => (
            <MultiSelect
              {...field}
              onChange={(v) => onChange(v.map((x) => x.value))}
              options={[]}
              allowCustomValue
              placeholder="Add new value"
              width={26}
            />
          )}
          defaultValue={[]}
          control={control}
          name="script_paths"
        />
      </InlineField>
      <InlineField
        label="Export client list"
        tooltip="Whether to scrape Client List specific metrics."
        {...commonOptions}
      >
        <InlineSwitch {...register("export_client_list")} />
      </InlineField>
      <InlineField
        label="Export client port"
        tooltip="Whether to include the client’s port when exporting the client list."
        {...commonOptions}
      >
        <InlineSwitch {...register("export_client_port")} />
      </InlineField>
      <InlineField
        label="Redis metrics only"
        tooltip="Whether to just export metrics or to also export go runtime metrics."
        {...commonOptions}
      >
        <InlineSwitch {...register("redis_metrics_only")} />
      </InlineField>
      <InlineField
        label="Ping on connect"
        tooltip="Whether to ping the Redis instance after connecting."
        {...commonOptions}
      >
        <InlineSwitch {...register("ping_on_connect")} />
      </InlineField>
      <InlineField
        label="Include system metrics"
        tooltip="Whether to include system metrics (e.g. redis_total_system_memory_bytes)."
        {...commonOptions}
      >
        <InlineSwitch {...register("incl_system_metrics")} />
      </InlineField>
      <InlineField
        label="Set client name"
        tooltip="Whether to set client name to redis_exporter."
        {...commonOptions}
      >
        <InlineSwitch {...register("set_client_name")} />
      </InlineField>
      <InlineField
        label="Tile38"
        tooltip="Whether to scrape Tile38-specific metrics."
        {...commonOptions}
      >
        <InlineSwitch {...register("is_tile38")} />
      </InlineField>
    </>
  );
};

export default PrometheusExporterRedis;
