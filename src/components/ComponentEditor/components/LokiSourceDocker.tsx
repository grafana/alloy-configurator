import { Collapse, FieldSet, InlineField } from "@grafana/ui";
import ReferenceSelect from "../inputs/ReferenceSelect";
import ReferenceMultiSelect from "../inputs/ReferenceMultiSelect";
import { useFormContext } from "react-hook-form";
import LabelsInput from "../inputs/LabelsInput";
import TypedInput from "../inputs/TypedInput";
import AuthenticationEditor from "../common/AuthenticationEditor";
import TlsBlock from "../common/TlsBlock";
import { useState } from "react";
import { mapToValues, valuesToMap } from "../../../lib/river";

const Component = () => {
  const {
    formState: { errors },
    control,
  } = useFormContext();
  const commonOptions = {
    labelWidth: 24,
  };

  const [clientConfigOpen, setClientConfigOpen] = useState(false);
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
        label="Targets"
        tooltip="List of docker container targets."
        {...commonOptions}
        error="You must specify the targets parameter"
        invalid={!!errors["targets"]}
      >
        <ReferenceSelect
          name="targets"
          exportName="list(map(string))"
          control={control}
        />
      </InlineField>
      <InlineField
        label="Forward to"
        tooltip="List of receivers to send log entries to."
        {...commonOptions}
        error="You must specify the destination"
        invalid={!!errors["forward_to"]}
      >
        <ReferenceMultiSelect
          name="forward_to"
          exportName="LokiReceiver"
          control={control}
        />
      </InlineField>
      <LabelsInput name="labels" control={control} />
      <Collapse
        label="Client Configuration"
        isOpen={clientConfigOpen}
        onToggle={() => setClientConfigOpen(!clientConfigOpen)}
        collapsible
      >
        <FieldSet label="Client Configuration">
          <AuthenticationEditor.Component parent="client" />
          <TlsBlock parent="client.tls_config" variant={"client"} />
        </FieldSet>
      </Collapse>
    </>
  );
};

const LokiSourceDocker = {
  preTransform(data: Record<string, any>): Record<string, any> {
    if (data.client) {
      data.client = AuthenticationEditor.preTransform(data.client);
    }
    if (data.labels) {
      data.labels = mapToValues(data.labels);
    }
    return data;
  },
  postTransform(data: Record<string, any>): Record<string, any> {
    if (data.client) {
      data.client = AuthenticationEditor.postTransform(data.client);
    }
    if (data.labels) {
      data.labels = valuesToMap(data.labels);
    }
    return data;
  },
  Component,
};
export default LokiSourceDocker;
