import { InlineField } from "@grafana/ui";
import { useFormContext } from "react-hook-form";

import TypedInput from "../inputs/TypedInput";

const Component = () => {
  const { control } = useFormContext();
  return (
    <>
      <InlineField
        label="Repository"
        tooltip="Source repository containing an alloy module"
        labelWidth={20}
      >
        <TypedInput width={64} control={control} name="repository" />
      </InlineField>
      <InlineField
        label="Revision"
        tooltip="Branch, Commit or Tag to use when checking out the repository"
        labelWidth={20}
      >
        <TypedInput
          width={64}
          placeholder="main"
          control={control}
          name="revision"
        />
      </InlineField>
      <InlineField
        label="Path"
        tooltip="Path of the alloy module file to import"
        labelWidth={20}
      >
        <TypedInput width={64} control={control} name="path" />
      </InlineField>
      <InlineField
        label="Pull frequency"
        tooltip="How often the repository should be checked for updates to the specified revision"
        labelWidth={20}
      >
        <TypedInput width={64} control={control} name="pull_frequency" />
      </InlineField>
    </>
  );
};

const ImportGit = {
  preTransform(data: Record<string, any>): Record<string, any> {
    return data;
  },
  postTransform(data: Record<string, any>): Record<string, any> {
    return data;
  },
  Component,
};

export default ImportGit;
