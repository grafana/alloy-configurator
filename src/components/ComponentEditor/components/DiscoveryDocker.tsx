import {
  Button,
  Collapse,
  FieldSet,
  InlineField,
  InlineFieldRow,
  InlineSwitch,
  Input,
  MultiSelect,
} from "@grafana/ui";
import { useState } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import AuthenticationEditor from "../common/AuthenticationEditor";
import TlsBlock from "../common/TlsBlock";
import TypedInput from "../inputs/TypedInput";

const Component = () => {
  const { register, control } = useFormContext<{
    [key: string]: any;
    filter: Array<Record<string, any>>;
  }>();
  const commonOptions = {
    labelWidth: 24,
  };
  const [tlsConfigOpen, setTlsConfigOpen] = useState(false);

  return (
    <>
      <InlineField
        label="Host"
        tooltip="Address of the Docker Daemon to connect to."
        {...commonOptions}
      >
        <TypedInput control={control} name="host" />
      </InlineField>
      <InlineField
        label="Enable HTTP2"
        tooltip="Whether HTTP2 is supported for requests."
        {...commonOptions}
      >
        <InlineSwitch {...register("enable_http2")} />
      </InlineField>
      <AuthenticationEditor.Component />
      <FieldSet label="Advanced Configuration">
        <Collapse
          label="TLS Settings"
          isOpen={tlsConfigOpen}
          onToggle={() => setTlsConfigOpen(!tlsConfigOpen)}
          collapsible
        >
          <TlsBlock parent="tls_config" variant={"client"} />
        </Collapse>
      </FieldSet>
    </>
  );
};

const DiscoveryDocker = {
  preTransform(data: Record<string, any>): Record<string, any> {
    data = AuthenticationEditor.preTransform(data);
    return data;
  },
  postTransform(data: Record<string, any>): Record<string, any> {
    data = AuthenticationEditor.postTransform(data);
    return data;
  },
  Component,
};

export default DiscoveryDocker;
