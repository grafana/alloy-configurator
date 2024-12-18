import { Collapse, FieldSet, InlineField, InlineSwitch } from "@grafana/ui";

import ReferenceMultiSelect from "../inputs/ReferenceMultiSelect";
import TypedInput from "../inputs/TypedInput";
import AuthenticationEditor from "../common/AuthenticationEditor";
import TlsBlock from "../common/TlsBlock";
import { useState } from "react";
import TargetSelector from "../common/TargetSelector";
import { useFormContext } from "react-hook-form";

const ProfileOptions = [
  { label: "Memory", name: "memory" },
  { label: "Block", name: "block" },
  { label: "Goroutines", name: "goroutine" },
  { label: "Mutex", name: "mutex" },
  { label: "CPU", name: "process_cpu" },
  { label: "fgprof", name: "fgprof" },
  { label: "Custom", name: "custom" },
];

const Component = () => {
  const [tlsConfigOpen, setTlsConfigOpen] = useState(false);
  const [profilingConfigOpen, setProfilingConfigOpen] = useState(false);

  const commonOptions = {
    labelWidth: 14,
  };

  const {
    control,
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <>
      <InlineField
        label="Forward to"
        tooltip="Receivers for the data scraped by this component"
        labelWidth={14}
        error="You must specify the destination"
        invalid={!!errors["forward_to"]}
      >
        <ReferenceMultiSelect
          name="forward_to"
          exportName="ProfilesReceiver"
          control={control}
        />
      </InlineField>
      <AuthenticationEditor.Component />
      <TargetSelector.Component />
      <FieldSet label="Advanced Configuration">
        <Collapse
          label="TLS Settings"
          isOpen={tlsConfigOpen}
          onToggle={() => setTlsConfigOpen(!tlsConfigOpen)}
          collapsible
        >
          <TlsBlock parent="tls_config" variant={"client"} />
        </Collapse>
        <Collapse
          label="Profiling Configuration"
          isOpen={profilingConfigOpen}
          onToggle={() => setProfilingConfigOpen(!profilingConfigOpen)}
          collapsible
        >
          <InlineField
            label="Path Prefix"
            tooltip="The path prefix to use when scraping targets."
            {...commonOptions}
          >
            <TypedInput control={control} name="profiling_config.path_prefix" />
          </InlineField>
          {ProfileOptions.map((o) => (
            <FieldSet label={<h5>{o.label}</h5>} key={o.name}>
              <InlineField label="Enabled" {...commonOptions}>
                <InlineSwitch
                  {...register(
                    `profiling_config.profile.${o.name}.enabled` as const,
                  )}
                />
              </InlineField>
              <InlineField
                label="Delta"
                tooltip="Whether to scrape the profile as a delta."
                {...commonOptions}
              >
                <InlineSwitch
                  {...register(
                    `profiling_config.profile.${o.name}.delta` as const,
                  )}
                />
              </InlineField>
              <InlineField
                label="Path"
                tooltip="The path to the profile type on the target."
                {...commonOptions}
              >
                <TypedInput
                  control={control}
                  name={`profiling_config.profile.${o.name}.path` as const}
                />
              </InlineField>
            </FieldSet>
          ))}
        </Collapse>
      </FieldSet>
    </>
  );
};

const PyroscopeScrape = {
  preTransform(data: Record<string, any>): Record<string, any> {
    data = AuthenticationEditor.preTransform(data);
    data = TargetSelector.preTransform(data);
    if (data.profiling_config) data.profiling_config.profile = {};
    const profilingConfig: Record<string, any> = {
      path_prefix: data.profiling_config.path_prefix,
      profile: {},
    };
    for (const k of Object.keys(data.profiling_config)) {
      if (k.startsWith("profile"))
        profilingConfig.profile[k.slice(8)] = data.profiling_config[k];
    }
    data.profiling_config = profilingConfig;
    return data;
  },
  postTransform(data: Record<string, any>): Record<string, any> {
    data = AuthenticationEditor.postTransform(data);
    data = TargetSelector.postTransform(data);
    for (const k of Object.keys(data.profiling_config?.profile)) {
      data.profiling_config[`profile.${k}`] = data.profiling_config.profile[k];
    }
    delete data.profiling_config.profile;
    return data;
  },
  Component,
};

export default PyroscopeScrape;
