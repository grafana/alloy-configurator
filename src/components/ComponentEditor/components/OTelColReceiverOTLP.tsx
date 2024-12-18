import {
  HorizontalGroup,
  InlineField,
  Input,
  InlineSwitch,
  VerticalGroup,
} from "@grafana/ui";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import TlsBlock from "../common/TlsBlock";
import ReferenceMultiSelect from "../inputs/ReferenceMultiSelect";

const Component = () => {
  const methods = useFormContext();
  const [httpEnableTLS, setHttpEnableTLS] = useState(
    methods.getValues().http?.tls,
  );
  const [grpcEnableTLS, setGrpcEnableTLS] = useState(
    methods.getValues().grpc?.tls,
  );

  const watchGrpcEnabled = methods.watch("grpc.enabled");
  const watchHttpEnabled = methods.watch("http.enabled");

  const commonOptions = {
    labelWidth: 25,
  };
  return (
    <>
      <h3 className="page-heading">GRPC</h3>
      <HorizontalGroup align="flex-start">
        <VerticalGroup>
          <h6>Basic Settings</h6>
          <InlineField label="Enable GRPC endpoint" {...commonOptions}>
            <InlineSwitch
              defaultValue="true"
              {...methods.register("grpc.enabled")}
            />
          </InlineField>
          <InlineField
            label="Endpoint"
            tooltip="host:port to listen for traffic on."
            disabled={!watchGrpcEnabled}
            {...commonOptions}
          >
            <Input
              {...methods.register("grpc.endpoint")}
              placeholder="0.0.0.0:4317"
            />
          </InlineField>
          <InlineField
            label="Transport"
            tooltip="Transport to use for the gRPC server."
            disabled={!watchGrpcEnabled}
            {...commonOptions}
          >
            <Input {...methods.register("grpc.transport")} placeholder="tcp" />
          </InlineField>
          <InlineField
            label="Max receive message size"
            tooltip="Maximum size of messages the server will accept. 0 disables a limit."
            disabled={!watchGrpcEnabled}
            {...commonOptions}
          >
            <Input
              {...methods.register("grpc.max_recv_msg_size", {
                valueAsNumber: true,
              })}
              type="number"
            />
          </InlineField>
          <InlineField
            label="Max concurrent streams"
            tooltip="Limit the number of concurrent streaming RPC calls."
            disabled={!watchGrpcEnabled}
            {...commonOptions}
          >
            <Input
              {...methods.register("grpc.max_concurrent_streams", {
                valueAsNumber: true,
              })}
              type="number"
            />
          </InlineField>
          <InlineField
            label="Read buffer size"
            tooltip="Size of the read buffer the gRPC server will use for reading from clients."
            disabled={!watchGrpcEnabled}
            {...commonOptions}
          >
            <Input
              {...methods.register("grpc.read_buffer_size")}
              placeholder="512KiB"
            />
          </InlineField>
          <InlineField
            label="Write buffer size"
            tooltip="Size of the write buffer the gRPC server will use for writing to clients."
            disabled={!watchGrpcEnabled}
            {...commonOptions}
          >
            <Input
              {...methods.register("grpc.write_buffer_size")}
              placeholder="512KiB"
            />
          </InlineField>
          <InlineField
            label="Include metadata"
            tooltip="Propagate incoming connection metadata to downstream consumers."
            disabled={!watchGrpcEnabled}
            {...commonOptions}
          >
            <InlineSwitch {...methods.register("grpc.include_metadata")} />
          </InlineField>
          <InlineField
            label="Enable TLS"
            disabled={!watchGrpcEnabled}
            {...commonOptions}
          >
            <InlineSwitch
              value={grpcEnableTLS}
              onChange={(e: React.FormEvent<HTMLInputElement>) => {
                setGrpcEnableTLS(e.currentTarget.checked);
              }}
            />
          </InlineField>
        </VerticalGroup>
        {grpcEnableTLS && (
          <TlsBlock
            variant="server"
            parent="grpc.tls"
            disabled={!watchGrpcEnabled}
          />
        )}
      </HorizontalGroup>
      <hr />
      <h3 className="page-heading">HTTP</h3>
      <HorizontalGroup align="flex-start">
        <VerticalGroup>
          <h6>Basic Settings</h6>
          <InlineField label="Enable HTTP endpoint" {...commonOptions}>
            <InlineSwitch
              defaultValue="true"
              {...methods.register("http.enabled")}
            />
          </InlineField>
          <InlineField
            label="Endpoint"
            tooltip="host:port to listen for traffic on."
            disabled={!watchHttpEnabled}
            {...commonOptions}
          >
            <Input
              {...methods.register("http.endpoint")}
              placeholder="0.0.0.0:4318"
            />
          </InlineField>
          <InlineField
            label="Max request body size"
            tooltip="Maximum request body size the server will allow. No limit when unset."
            disabled={!watchHttpEnabled}
            {...commonOptions}
          >
            <Input {...methods.register("http.max_request_body_size")} />
          </InlineField>
          <InlineField
            label="Include metadata"
            tooltip="Propagate incoming connection metadata to downstream consumers."
            disabled={!watchHttpEnabled}
            {...commonOptions}
          >
            <InlineSwitch {...methods.register("http.include_metadata")} />
          </InlineField>
          <InlineField
            label="Enable TLS"
            disabled={!watchHttpEnabled}
            {...commonOptions}
          >
            <InlineSwitch
              value={httpEnableTLS}
              {...methods.register("http.enable_tls")}
              onChange={(e: React.FormEvent<HTMLInputElement>) => {
                setHttpEnableTLS(e.currentTarget.checked);
              }}
            />
          </InlineField>
        </VerticalGroup>
        {httpEnableTLS && (
          <TlsBlock
            variant="server"
            disabled={!watchHttpEnabled}
            parent="http.tls"
          />
        )}
      </HorizontalGroup>
      <hr />
      <h3 className="page-heading">Output</h3>
      <VerticalGroup>
        <InlineField label="Metrics" {...commonOptions}>
          <ReferenceMultiSelect
            control={methods.control}
            name="output.metrics"
            exportName="otel.MetricsConsumer"
          />
        </InlineField>
        <InlineField label="Logs" {...commonOptions}>
          <ReferenceMultiSelect
            control={methods.control}
            name="output.logs"
            exportName="otel.LogsConsumer"
          />
        </InlineField>
        <InlineField label="traces" {...commonOptions}>
          <ReferenceMultiSelect
            control={methods.control}
            name="output.traces"
            exportName="otel.TracesConsumer"
          />
        </InlineField>
      </VerticalGroup>
    </>
  );
};

const OTelColReceiverOTLP = {
  preTransform(data: Record<string, any>): Record<string, any> {
    if (data.http) {
      data.http["enabled"] = true;
    }
    if (data.grpc) {
      data.grpc["enabled"] = true;
    }
    return data;
  },
  postTransform(data: Record<string, any>): Record<string, any> {
    const transformed = data;
    if (!data.http?.enable_tls) {
      delete transformed["http"]["tls"];
    }
    delete transformed["http"]["enable_tls"];
    if (!data.grpc?.enable_tls) {
      delete transformed["grpc"]["tls"];
    }
    delete transformed["grpc"]["enable_tls"];

    if (!data.grpc?.enabled) {
      delete transformed["grpc"];
    } else {
      delete transformed["grpc"]["enabled"];
    }
    if (!data.http?.enabled) {
      delete transformed["http"];
    } else {
      delete transformed["http"]["enabled"];
    }
    return transformed;
  },
  Component,
};

export default OTelColReceiverOTLP;
