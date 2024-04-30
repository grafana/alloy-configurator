import { InlineField } from "@grafana/ui";
import { useFormContext } from "react-hook-form";
import { Argument, Attribute, Block } from "../../../lib/river";
import TypedInput from "../../ComponentEditor/inputs/TypedInput";
import { Destination } from "../types/destination";
import { TelemetryType } from "../types/telemetry";
import { MBadge } from "./badges";

const AdvancedForm = () => {
  const { control } = useFormContext<Record<string, any>>();
  return (
    <>
      <InlineField label="API Key">
        <TypedInput name="github.api_key" control={control} />
      </InlineField>
    </>
  );
};

const GitHub = {
  label: "GitHub",
  value: "github",
  imgUrl: `https://storage.googleapis.com/grafanalabs-integration-logos/github.png`,
  component: MBadge,
  supports: ["metrics"] as TelemetryType[],
  template(d: Destination, advanced?: Record<string, any>) {
    const args: Argument[] = [];
    if (advanced?.github?.api_key)
      args.push(new Attribute("api_token", advanced.github.api_key));
    return (
      `prometheus.scrape "github" {
  targets = prometheus.exporter.github.default.targets
  forward_to = [
    ${d.metrics.receiver},
  ]
}
` + new Block("prometheus.exporter.github", "default", args).marshal()
    );
  },
  advancedForm: AdvancedForm,
  defaults: {
    api_key: { "-function": { name: "env", params: ["GITHUB_TOKEN"] } },
  },
};

export default GitHub;
