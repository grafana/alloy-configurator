import { Attribute, Block } from "../../lib/river";

function promScrapePushExample(collector: Block): string {
  return (
    `import.git "grafana_cloud" {
  repository = "https://github.com/grafana/alloy-modules.git"
  revision = "main"
  path = "modules/cloud/grafana/cloud/module.alloy"
  pull_frequency = "24h"
}

grafana_cloud.stack "receivers" {
  stack_name = "mystack" // Replace this with your stack name
  token = env("GRAFANA_CLOUD_TOKEN")
}

prometheus.scrape "default" {
  targets = ${collector.name}.${collector.label ? collector.label + "." : ""
    }targets
  forward_to = [
    grafana_cloud.stack.receivers.metrics
  ]
}
` +
    collector.marshal() +
    "\n\n"
  );
}

const Examples: Array<{ name: string; source: string; logo: string }> = [
  {
    name: "Redis",
    source: promScrapePushExample(
      new Block("prometheus.exporter.redis", "default", [
        new Attribute("redis_addr", "localhost:6379"),
      ]),
    ),
    logo: "https://storage.googleapis.com/grafanalabs-integration-logos/redis.png",
  },
  {
    name: "MySQL",
    source: promScrapePushExample(
      new Block("prometheus.exporter.mysql", "default", [
        new Attribute("data_source_name", "root@(server-a:3306)/"),
      ]),
    ),
    logo: "https://storage.googleapis.com/grafanalabs-integration-logos/mysql.png",
  },
  {
    name: "GitHub",
    source: promScrapePushExample(
      new Block("prometheus.exporter.github", "default", []),
    ),
    logo: "https://storage.googleapis.com/grafanalabs-integration-logos/github.png",
  },
  {
    name: "OpenTelemetry to Grafana Cloud",
    source: `import.git "grafana_cloud" {
  repository = "https://github.com/grafana/alloy-modules.git"
  revision = "main"
  path = "modules/cloud/grafana/cloud/module.alloy"
  pull_frequency = "24h"
}

grafana_cloud.stack "receivers" {
  stack_name = "stackName" // replace this with your stack name
  token = env("GRAFANA_CLOUD_TOKEN")
}
otelcol.exporter.prometheus "to_prometheus" {
  forward_to = [
    grafana_cloud.stack.receivers.metrics,
  ]
}

otelcol.exporter.loki "to_loki" {
  forward_to = [
    grafana_cloud.stacks.receivers.logs,
  ]
}

otelcol.receiver.otlp "default" {
  grpc {}
  http {}
  output {
    metrics = [otelcol.exporter.prometheus.to_prometheus.input]
    logs = [otelcol.exporter.loki.to_loki.input]
    traces = [grafana_cloud.stack.receivers.traces]
  }
}
`,
    logo: `${process.env.PUBLIC_URL}/logos/otel.png`,
  },
  {
    name: "Monitor a Linux Host",
    source: `import.git "grafana_cloud" {
  repository = "https://github.com/grafana/alloy-modules.git"
  revision = "main"
  path = "modules/cloud/grafana/cloud/module.alloy"
  pull_frequency = "24h"
}

grafana_cloud.stack "receivers" {
  stack_name = "stackName"
  token = env("GRAFANA_CLOUD_TOKEN")
}
prometheus.scrape "linux_node" {
  targets = prometheus.exporter.unix.node.targets
  forward_to = [
    grafana_cloud.stack.receivers.metrics,
  ]
}

prometheus.exporter.unix "node" {
}

loki.relabel "journal" {
  forward_to = []

  rule {
    source_labels = ["__journal__systemd_unit"]
    target_label  = "unit"
  }
  rule {
    source_labels = ["__journal__boot_id"]
    target_label  = "boot_id"
  }
  rule {
    source_labels = ["__journal__transport"]
    target_label  = "transport"
  }
  rule {
    source_labels = ["__journal_priority_keyword"]
    target_label  = "level"
  }
  rule {
    source_labels = ["__journal__hostname"]
    target_label  = "instance"
  }
}

loki.source.journal "read" {
  forward_to = [
    grafana_cloud.stack.receivers.logs,
  ]
  relabel_rules = loki.relabel.journal.rules
  labels = {
    "job" = "integrations/node_exporter",
  }
}`,
    logo: "https://storage.googleapis.com/grafanalabs-integration-logos/linux.png",
  },
];
export default Examples;
