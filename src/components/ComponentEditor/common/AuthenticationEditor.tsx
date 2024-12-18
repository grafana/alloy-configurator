import { SelectableValue } from "@grafana/data";
import {
  Alert,
  FieldSet,
  InlineField,
  MultiSelect,
  RadioButtonGroup,
} from "@grafana/ui";
import { Controller, useFormContext } from "react-hook-form";
import TypedInput from "../inputs/TypedInput";

type AuthenticationType =
  | "none"
  | "in_cluster"
  | "bearer"
  | "basic_auth"
  | "authorization"
  | "oauth2";
const Component = ({
  options,
  defaultValue,
  parent,
}: {
  options?: AuthenticationType[];
  defaultValue?: AuthenticationType;
  parent?: string;
}) => {
  const { watch, control } = useFormContext();
  const commonOptions = {
    labelWidth: 24,
  };
  if (!options) {
    options = ["none", "bearer", "basic_auth", "authorization", "oauth2"];
  }
  if (!defaultValue) {
    defaultValue = "none";
  }
  parent = parent ? parent + "." : "";
  const watchAuthType = watch(`${parent}auth_type` as const);
  return (
    <FieldSet label="Authentication">
      <Controller
        name={`${parent}auth_type` as const}
        control={control}
        defaultValue={defaultValue}
        render={({ field: { ref, ...f } }) => (
          <RadioButtonGroup
            fullWidth
            {...f}
            options={[
              {
                value: "none",
                label: "None",
              },
              {
                value: "in_cluster",
                label: "In-cluster",
              },
              {
                value: "bearer",
                label: "Bearer Token",
              },
              {
                value: "basic_auth",
                label: "Basic Auth",
              },
              {
                value: "authorization",
                label: "Authorization Header",
              },
              {
                value: "oauth2",
                label: "OAuth2",
              },
            ].filter((x) => options?.some((n) => n === x.value))}
          />
        )}
      />
      {watchAuthType === "in_cluster" && (
        <Alert
          severity="info"
          title="No further configuration is neccesarry when running alloy in a
            Kubernetes environment with the correct service account"
        />
      )}
      {watchAuthType === "basic_auth" && (
        <>
          <InlineField label="Username" {...commonOptions}>
            <TypedInput
              name={`${parent}basic_auth.username`}
              control={control}
            />
          </InlineField>
          <InlineField label="Password" {...commonOptions}>
            <TypedInput
              name={`${parent}basic_auth.password`}
              control={control}
            />
          </InlineField>
          <InlineField label="Password file" {...commonOptions}>
            <TypedInput
              name={`${parent}basic_auth.password_file`}
              control={control}
            />
          </InlineField>
        </>
      )}
      {watchAuthType === "bearer" && (
        <>
          <InlineField
            label="Bearer token"
            tooltip="Bearer token to authenticate with."
            {...commonOptions}
          >
            <TypedInput name={`${parent}bearer_token`} control={control} />
          </InlineField>
          <InlineField
            label="Bearer token file"
            tooltip="File containing a bearer token to authenticate with."
            {...commonOptions}
          >
            <TypedInput name={`${parent}bearer_token_file`} control={control} />
          </InlineField>
        </>
      )}
      {watchAuthType === "authorization" && (
        <>
          <InlineField
            label="Type"
            tooltip="Authorization type, for example, 'Bearer'"
            {...commonOptions}
          >
            <TypedInput
              name={`${parent}authorization.type`}
              control={control}
            />
          </InlineField>
          <InlineField label="Credentials" {...commonOptions}>
            <TypedInput
              name={`${parent}authorization.credentials`}
              control={control}
            />
          </InlineField>
          <InlineField label="Credentials file" {...commonOptions}>
            <TypedInput
              name={`${parent}authorization.credentials_file`}
              control={control}
            />
          </InlineField>
        </>
      )}
      {watchAuthType === "oauth2" && (
        <>
          <InlineField label="Client ID" {...commonOptions}>
            <TypedInput name={`${parent}oauth2.client_id`} control={control} />
          </InlineField>
          <InlineField label="Client secret" {...commonOptions}>
            <TypedInput
              name={`${parent}oauth2.client_secret`}
              control={control}
            />
          </InlineField>
          <InlineField label="Client secret file" {...commonOptions}>
            <TypedInput
              name={`${parent}oauth2.client_secret_file`}
              control={control}
            />
          </InlineField>
          <InlineField label="Scopes" {...commonOptions}>
            <Controller
              name={`${parent}oauth2.scopes`}
              control={control}
              render={({ field: { ref, ...f } }) => (
                <MultiSelect
                  {...f}
                  allowCustomValue
                  placeholder="Enter to add"
                />
              )}
            />
          </InlineField>
          <InlineField label="Token URL" {...commonOptions}>
            <TypedInput name={`${parent}oauth2.token_url`} control={control} />
          </InlineField>
          <InlineField label="Proxy URL" {...commonOptions}>
            <TypedInput name={`${parent}oauth2.proxy_url`} control={control} />
          </InlineField>
        </>
      )}
    </FieldSet>
  );
};

const AuthenticationEditor = {
  Component,
  preTransform(
    data: Record<string, any>,
    def: AuthenticationType = "none",
  ): Record<string, any> {
    data["auth_type"] = def;
    if (data.bearer_token || data.bearer_token_file)
      data["auth_type"] = "bearer";
    if (data.oauth2?.client_id) data["auth_type"] = "oauth2";
    if (
      data.authorization?.type ||
      data.authorization?.credentials ||
      data.authorization?.credentials_file
    )
      data["auth_type"] = "authorization";
    if (
      data.basic_auth?.username ||
      data.basic_auth?.password ||
      data.basic_auth?.password_file
    )
      data["auth_type"] = "basic_auth";
    return data;
  },
  postTransform(data: Record<string, any>): Record<string, any> {
    switch (data["auth_type"]) {
      case "bearer":
        delete data["oauth2"];
        delete data["basic_auth"];
        delete data["authorization"];
        break;
      case "oauth2":
        data.oauth2.scopes = data.oauth2.scopes.map(
          (x: string | SelectableValue<string>) =>
            typeof x === "object" ? x.value : x,
        );

        delete data["bearer_token"];
        delete data["bearer_token_file"];
        delete data["basic_auth"];
        delete data["authorization"];
        break;
      case "authorization":
        delete data["bearer_token"];
        delete data["bearer_token_file"];
        delete data["basic_auth"];
        delete data["oauth2"];
        break;
      case "basic_auth":
        delete data["bearer_token"];
        delete data["bearer_token_file"];
        delete data["authorization"];
        delete data["oauth2"];
        break;
      default:
        delete data["bearer_token"];
        delete data["bearer_token_file"];
        delete data["authorization"];
        delete data["oauth2"];
        delete data["basic_auth"];
        break;
    }
    delete data["auth_type"];
    return data;
  },
};

export default AuthenticationEditor;
