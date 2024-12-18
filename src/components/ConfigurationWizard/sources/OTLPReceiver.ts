import { Destination } from "../types/destination";
import { TelemetryType } from "../types/telemetry";
import { LMTBadge } from "./badges";

const OTLPReceiver = {
  label: "OpenTelemetry Receiver",
  value: "otlp",
  imgUrl: `${process.env.PUBLIC_URL}/logos/otel.png`,
  component: LMTBadge,
  supports: ["logs", "metrics", "traces"] as TelemetryType[],
  template(d: Destination) {
    let out = "";
    if (d.metrics.enabled) {
      out += `otelcol.exporter.prometheus "to_prometheus" {
  forward_to = [
    ${d.metrics.receiver},
  ]
}

`;
    }
    if (d.logs.enabled) {
      out += `otelcol.exporter.loki "to_loki" {
  forward_to = [
    grafana_cloud.stack.receivers.logs,
  ]
}

`;
    }
    out += `otelcol.receiver.otlp "default" {
  grpc {}
  http {}
  output {
    metrics = [${d.metrics.enabled ? "otelcol.exporter.prometheus.to_prometheus.input" : ""
      }]
    logs = [${d.logs.enabled ? "otelcol.exporter.loki.to_loki.input" : ""}]
    traces = [${d.traces.enabled ? d.traces.receiver : ""}]
  }
}
`;
    return out;
  },
};

export default OTLPReceiver;
