import {
  Collapse,
  FieldSet,
  InlineField,
  InlineSwitch,
  Input,
} from "@grafana/ui";

import ReferenceMultiSelect from "../inputs/ReferenceMultiSelect";
import TargetSelector from "../common/TargetSelector";
import AuthenticationEditor from "../common/AuthenticationEditor";
import { useState } from "react";
import TypedInput from "../inputs/TypedInput";
import TlsConfig from "../common/TlsConfig";
import { useFormContext } from "react-hook-form";

const Component = () => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext();
  const [tlsConfigOpen, setTlsConfigOpen] = useState(false);
  const [limitConfigOpen, setLimitConfigOpen] = useState(false);
  const [connConfigOpen, setConnConfigOpen] = useState(false);

  const commonOptions = {
    labelWidth: 24,
  };
  return (
    <>
      <FieldSet label="Basic Settings">
        <InlineField
          label="Forward to"
          tooltip="Receivers for the data scraped by this component"
          error="You must specify the destination"
          invalid={!!errors["forward_to"]}
          {...commonOptions}
        >
          <ReferenceMultiSelect
            name="forward_to"
            exportName="PrometheusReceiver"
            control={control}
          />
        </InlineField>
        <InlineField
          label="Scrape interval"
          tooltip="How frequently to scrape the targets of this scrape config."
          {...commonOptions}
        >
          <Input {...register("scrape_interval")} placeholder="60s" />
        </InlineField>
        <InlineField
          label="Scrape timeout"
          tooltip="The timeout for scraping targets of this config."
          {...commonOptions}
        >
          <Input {...register("scrape_timeout")} placeholder="10s" />
        </InlineField>
        <InlineField
          label="Metrics path"
          tooltip="The HTTP resource path on which to fetch metrics from targets."
          {...commonOptions}
        >
          <Input placeholder="/metrics" {...register("metrics_path")} />
        </InlineField>
        <InlineField
          label="Job name"
          tooltip="string	The job name to override the job label with. Defaults to the component name."
          {...commonOptions}
        >
          <Input {...register("job_name")} />
        </InlineField>
      </FieldSet>
      <AuthenticationEditor.Component />
      <TargetSelector.Component />
      <FieldSet label="Advanced Configuration">
        <InlineField
          label="Extra metrics"
          tooltip="Whether extra metrics should be generated for scrape targets."
          {...commonOptions}
        >
          <InlineSwitch {...register("extra_metrics")} />
        </InlineField>
        <InlineField
          label="Honor timestamps"
          tooltip="Indicator whether the scraped timestamps should be respected."
          {...commonOptions}
        >
          <InlineSwitch {...register("honor_timestamps")} />
        </InlineField>
        <InlineField
          label="Honor labels"
          tooltip="Indicator whether the scraped metrics should remain unmodified."
          {...commonOptions}
        >
          <InlineSwitch {...register("honor_labels")} />
        </InlineField>
        <Collapse
          label="TLS Settings"
          isOpen={tlsConfigOpen}
          onToggle={() => setTlsConfigOpen(!tlsConfigOpen)}
          collapsible
        >
          <TlsConfig parent="tls_config" />
        </Collapse>
        <Collapse
          label="Limit Configuration"
          isOpen={limitConfigOpen}
          onToggle={() => setLimitConfigOpen(!limitConfigOpen)}
          collapsible
        >
          <InlineField
            label="Body Size Limit"
            tooltip="An uncompressed response body larger than this many bytes causes the scrape to fail. 0 means no limit."
            {...commonOptions}
          >
            <Input
              type="number"
              {...register("body_size_limit", { valueAsNumber: true })}
            />
          </InlineField>
          <InlineField
            label="Sample limit"
            tooltip="More than this many samples post metric-relabeling causes the scrape to fail."
            {...commonOptions}
          >
            <Input
              type="number"
              {...register("sample_limit", { valueAsNumber: true })}
            />
          </InlineField>
          <InlineField
            label="Target limit"
            tooltip="More than this many targets after the target relabeling causes the scrapes to fail."
            {...commonOptions}
          >
            <Input
              type="number"
              {...register("target_limit", { valueAsNumber: true })}
            />
          </InlineField>
          <InlineField
            label="Label limit"
            tooltip="More than this many labels post metric-relabeling causes the scrape to fail."
            {...commonOptions}
          >
            <Input
              type="number"
              {...register("label_limit", { valueAsNumber: true })}
            />
          </InlineField>
          <InlineField
            label="Label name length limit"
            tooltip="More than this label name length post metric-relabeling causes the scrape to fail."
            {...commonOptions}
          >
            <Input
              type="number"
              {...register("label_name_length_limit", {
                valueAsNumber: true,
              })}
            />
          </InlineField>
          <InlineField
            label="Label value length limit"
            tooltip="More than this label value length post metric-relabeling causes the scrape to fail."
            {...commonOptions}
          >
            <Input
              type="number"
              {...register("label_value_length_limit", {
                valueAsNumber: true,
              })}
            />
          </InlineField>
        </Collapse>
        <Collapse
          label="Connection Configuration"
          isOpen={connConfigOpen}
          onToggle={() => setConnConfigOpen(!connConfigOpen)}
          collapsible
        >
          <InlineField label="Scheme" {...commonOptions}>
            <TypedInput control={control} name="scheme" placeholder="http" />
          </InlineField>
          <InlineField
            label="Follow redirects"
            tooltip="Whether redirects returned by the server should be followed."
            {...commonOptions}
          >
            <InlineSwitch {...register("follow_redirects")} />
          </InlineField>
          <InlineField label="Enable HTTP2" {...commonOptions}>
            <InlineSwitch {...register("enable_http2")} />
          </InlineField>
          <InlineField label="Proxy URL" {...commonOptions}>
            <TypedInput control={control} name="proxy_url" />
          </InlineField>
        </Collapse>
      </FieldSet>
    </>
  );
};

const PrometheusScrape = {
  preTransform(data: Record<string, any>): Record<string, any> {
    data = TargetSelector.preTransform(data);
    data = AuthenticationEditor.preTransform(data);
    return data;
  },
  postTransform(data: Record<string, any>): Record<string, any> {
    data = TargetSelector.postTransform(data);
    data = AuthenticationEditor.postTransform(data);
    return data;
  },
  Component,
};

export default PrometheusScrape;
