import {
  InlineField,
  Input,
  TextArea,
  VerticalGroup,
  Switch,
} from "@grafana/ui";
import { useFormContext } from "react-hook-form";

type Variant = "server" | "client";

const TlsBlock = ({
  parent,
  variant,
  disabled,
}: {
  parent: string;
  variant: Variant;
  disabled?: boolean;
}) => {
  const { register } = useFormContext();
  const commonOptions = {
    labelWidth: 25,
    disabled: disabled || false,
  };
  return (
    <VerticalGroup>
      <InlineField
        label="CA PEM"
        tooltip="CA PEM-encoded text to validate the server with."
        {...commonOptions}
      >
        <TextArea {...register(`${parent}.ca_pem` as const)} />
      </InlineField>
      <InlineField
        label="CA File"
        tooltip="Path to the CA file."
        {...commonOptions}
      >
        <Input {...register(`${parent}.ca_file` as const)} />
      </InlineField>
      <InlineField
        label="TLS Certificate PEM"
        tooltip="Certificate PEM-encoded text"
        {...commonOptions}
      >
        <TextArea {...register(`${parent}.cert_pem` as const)} />
      </InlineField>
      <InlineField
        label="TLS Certificate file"
        tooltip="Path to the TLS certificate."
        {...commonOptions}
      >
        <Input {...register(`${parent}.cert_file` as const)} />
      </InlineField>
      <InlineField
        label="Key PEM"
        tooltip="PEM encoded key for the certificate."
        {...commonOptions}
      >
        <TextArea {...register(`${parent}.key_pem` as const)} />
      </InlineField>
      <InlineField
        label="Key file"
        tooltip="Path to the certificate key"
        {...commonOptions}
      >
        <Input {...register(`${parent}.key_file` as const)} />
      </InlineField>
      <InlineField
        label="Minimum TLS version"
        tooltip="Minimum acceptable TLS version for connections."
        {...commonOptions}
      >
        <Input
          {...register(`${parent}.min_version` as const)}
          placeholder="TLS 1.2"
        />
      </InlineField>
      <InlineField
        label="Maximum TLS version"
        tooltip="Maximum acceptable TLS version for connections."
        {...commonOptions}
      >
        <Input
          {...register(`${parent}.max_version` as const)}
          placeholder="TLS 1.3"
        />
      </InlineField>
      <InlineField
        label="Reload interval"
        tooltip="The duration after which the certificate will be reloaded. Set to 0s disable reloading of the certificate."
        {...commonOptions}
      >
        <Input
          {...register(`${parent}.reload_interval` as const)}
          placeholder="0s"
        />
      </InlineField>
      {variant === "server" && (
        <InlineField
          label="Client CA File"
          tooltip="Path to the CA file used to authenticate client certificates."
          {...commonOptions}
        >
          <Input {...register(`${parent}.client_ca_file` as const)} />
        </InlineField>
      )}
      {variant === "client" && [
        <InlineField
          label="Server Name"
          tooltip="Verifies the hostname of server certificates when set."
          {...commonOptions}
        >
          <Input {...register(`${parent}.server_name` as const)} />
        </InlineField>,
        <InlineField
          label="Insecure"
          tooltip="Disables TLS when connecting to the configured server."
          {...commonOptions}
        >
          <Switch {...register(`${parent}.insecure` as const)} />
        </InlineField>,
        <InlineField
          label="Skip TLS verification"
          tooltip="Ignores insecure server TLS certificates."
          {...commonOptions}
        >
          <Switch {...register(`${parent}.insecure_skip_verify` as const)} />
        </InlineField>,
      ]}
    </VerticalGroup>
  );
};

export default TlsBlock;
