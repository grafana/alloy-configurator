import { InlineField } from "@grafana/ui";
import { useFormContext } from "react-hook-form";
import { Argument, Attribute, Block } from "../../../lib/river";
import LabelsInput from "../../ComponentEditor/inputs/LabelsInput";
import TypedInput from "../../ComponentEditor/inputs/TypedInput";
import { Destination } from "../types/destination";
import { TelemetryType } from "../types/telemetry";
import { LBadge } from "./badges";

const AdvancedForm = () => {
  const { control } = useFormContext<Record<string, any>>();
  return (
    <>
      <InlineField label="Docker Socket">
        <TypedInput name="docker.socket" control={control} />
      </InlineField>
      <LabelsInput control={control} name="docker.labels" />
    </>
  );
};

const Docker = {
  label: "Docker",
  value: "docker",
  imgUrl: `https://storage.googleapis.com/grafanalabs-integration-logos/docker.png`,
  component: LBadge,
  supports: ["metrics"] as TelemetryType[],
  template(d: Destination, advanced?: Record<string, any>) {
    const socket = advanced?.docker?.socket ?? "unix:///var/run/docker.sock";
    const args: Argument[] = [];
    args.push(new Attribute("host", socket));
    args.push(
      new Attribute("targets", {
        "-reference": "discovery.docker.linux.targets",
      }),
    );
    args.push(
      new Attribute("relabel_rules", {
        "-reference": "discovery.relabel.logs_integrations_docker.rules",
      }),
    );
    if (advanced?.docker?.labels) {
      args.push(
        new Attribute(
          "labels",
          (
            advanced.docker.labels as Array<{ key: string; value: string }>
          ).reduce((acc, a) => ({ ...acc, [a.key]: a.value }), {}),
        ),
      );
    }
    args.push(new Attribute("forward_to", [{ "-reference": d.logs.receiver }]));
    return (
      `discovery.docker "linux" {
  host = "${socket}"
}
discovery.relabel "logs_integrations_docker" {
    targets = []

    rule {
        target_label = "job"
        replacement  = "integrations/docker"
    }

    rule {
        target_label = "instance"
        replacement  = constants.hostname
    }

    rule {
        source_labels = ["__meta_docker_container_name"]
        regex         = "/(.*)"
        target_label  = "container"
    }

    rule {
        source_labels = ["__meta_docker_container_log_stream"]
        target_label  = "stream"
    }
}
` + new Block("loki.source.docker", "default", args).marshal()
    );
  },
  advancedForm: AdvancedForm,
  defaults: {},
};

export default Docker;
