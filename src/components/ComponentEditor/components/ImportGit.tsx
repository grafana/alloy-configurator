import { FormAPI, InlineField } from "@grafana/ui";

import TypedInput from "../inputs/TypedInput";

const Component = ({ methods }: { methods: FormAPI<Record<string, any>> }) => {
  return (
    <>
      <InlineField
        label="Repository"
        tooltip="Source repository containing an alloy module"
        labelWidth={20}
      >
        <TypedInput width={64} control={methods.control} name="repository" />
      </InlineField>
      <InlineField
        label="Revision"
        tooltip="Branch, Commit or Tag to use when checking out the repository"
        labelWidth={20}
      >
        <TypedInput
          width={64}
          placeholder="main"
          control={methods.control}
          name="revision"
        />
      </InlineField>
      <InlineField
        label="Path"
        tooltip="Path of the alloy module file to import"
        labelWidth={20}
      >
        <TypedInput width={64} control={methods.control} name="path" />
      </InlineField>
      <InlineField
        label="Pull frequency"
        tooltip="How often the repository should be checked for updates to the specified revision"
        labelWidth={20}
      >
        <TypedInput
          width={64}
          control={methods.control}
          name="pull_frequency"
        />
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
