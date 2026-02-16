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
    grafana_cloud.stack.receivers.metrics,
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
    grafana_cloud.stack.receivers.logs,
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
  {
    name: "Monitor a Windows Host",
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

prometheus.exporter.windows "integrations_windows_exporter" {
  enabled_collectors = ["cpu", "cs", "logical_disk", "net", "os", "service", "system", "textfile", "time", "diskdrive"]
}
discovery.relabel "integrations_windows_exporter" {
  targets = prometheus.exporter.windows.integrations_windows_exporter.targets
  rule {
    target_label = "job"
    replacement  = "integrations/windows_exporter"
  }
  rule {
    target_label = "instance"
    replacement  = constants.hostname
  }
}
prometheus.scrape "integrations_windows_exporter" {
  targets    = discovery.relabel.integrations_windows_exporter.output
  forward_to = [prometheus.relabel.integrations_windows_exporter.receiver]
  job_name   = "integrations/windows_exporter"
}
prometheus.relabel "integrations_windows_exporter" {
  forward_to = [prometheus.remote_write.metrics_service.receiver]
  rule {
    source_labels = ["volume"]
    regex         = "HarddiskVolume.*"
    action        = "drop"
  }
  rule {
    action = "keep"
    regex = "up|windows_cpu_interrupts_total|windows_cpu_time_total|windows_cs_hostname|windows_cs_logical_processors|windows_cs_physical_memory_bytes|windows_disk_drive_status|windows_logical_disk_avg_read_requests_queued|windows_logical_disk_avg_write_requests_queued|windows_logical_disk_free_bytes|windows_logical_disk_idle_seconds_total|windows_logical_disk_read_bytes_total|windows_logical_disk_read_seconds_total|windows_logical_disk_reads_total|windows_logical_disk_size_bytes|windows_logical_disk_write_bytes_total|windows_logical_disk_write_seconds_total|windows_logical_disk_writes_total|windows_net_bytes_received_total|windows_net_bytes_sent_total|windows_net_packets_outbound_discarded_total|windows_net_packets_outbound_errors_total|windows_net_packets_received_discarded_total|windows_net_packets_received_errors_total|windows_net_packets_received_unknown_total|windows_os_info|windows_os_paging_limit_bytes|windows_os_physical_memory_free_bytes|windows_os_timezone|windows_service_status|windows_system_context_switches_total|windows_system_processor_queue_length|windows_system_system_up_time|windows_time_computed_time_offset_seconds|windows_time_ntp_round_trip_delay_seconds"
    source_labels = ["__name__"]
  }
}
loki.process "logs_integrations_windows_exporter_application" {
  forward_to = [loki.write.grafana_cloud_loki.receiver]
  stage.json {
    expressions = {
      level  = "levelText",
      source = "source",
    }
  }
  stage.labels {
    values = {
      level  = "",
      source = "",
    }
  }
}
loki.relabel "logs_integrations_windows_exporter_application" {
  forward_to = [loki.process.logs_integrations_windows_exporter_application.receiver]
  rule {
    source_labels = ["computer"]
    target_label  = "agent_hostname"
  }
}
loki.source.windowsevent "logs_integrations_windows_exporter_application" {
  locale                 = 1033
  eventlog_name          = "Application"
  bookmark_path          = "./bookmarks-app.xml"
  poll_interval          = "0s"
  use_incoming_timestamp = true
  forward_to             = [loki.relabel.logs_integrations_windows_exporter_application.receiver]
  labels                 = {
    instance = constants.hostname,
    job      = "integrations/windows_exporter",
  }
}
loki.process "logs_integrations_windows_exporter_system" {
  forward_to = [loki.write.grafana_cloud_loki.receiver]
  stage.json {
    expressions = {
      level  = "levelText",
      source = "source",
    }
  }
  stage.labels {
    values = {
      level  = "",
      source = "",
    }
  }
}
loki.relabel "logs_integrations_windows_exporter_system" {
  forward_to = [loki.process.logs_integrations_windows_exporter_system.receiver]
  rule {
    source_labels = ["computer"]
    target_label  = "agent_hostname"
  }
}
loki.source.windowsevent "logs_integrations_windows_exporter_system" {
  locale                 = 1033
  eventlog_name          = "System"
  bookmark_path          = "./bookmarks-sys.xml"
  poll_interval          = "0s"
  use_incoming_timestamp = true
  forward_to             = [loki.relabel.logs_integrations_windows_exporter_system.receiver]
  labels                 = {
    instance = constants.hostname,
    job      = "integrations/windows_exporter",
  }
}`,
    logo: "https://storage.googleapis.com/grafanalabs-integration-logos/windows.png",
  },
  {
    name: "Monitor a macOS Host",
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

prometheus.exporter.unix "integrations_node_exporter" { }
discovery.relabel "integrations_node_exporter" {
    targets = prometheus.exporter.unix.integrations_node_exporter.targets
    rule {
        target_label = "instance"
        replacement  = constants.hostname
    }
    rule {
        target_label = "job"
        replacement  = "integrations/macos-node"
    }
}
prometheus.scrape "integrations_node_exporter" {
    targets    = discovery.relabel.integrations_node_exporter.output
    forward_to = [prometheus.relabel.integrations_node_exporter.receiver]
    job_name   = "integrations/node_exporter"
}
prometheus.relabel "integrations_node_exporter" {
    forward_to = [prometheus.remote_write.metrics_service.receiver]
    rule {
        source_labels = ["__name__"]
        regex         = "up|node_boot_time_seconds|node_cpu_seconds_total|node_disk_io_time_seconds_total|node_disk_read_bytes_total|node_disk_written_bytes_total|node_filesystem_avail_bytes|node_filesystem_files|node_filesystem_files_free|node_filesystem_readonly|node_filesystem_size_bytes|node_load1|node_load15|node_load5|node_memory_compressed_bytes|node_memory_internal_bytes|node_memory_purgeable_bytes|node_memory_swap_total_bytes|node_memory_swap_used_bytes|node_memory_total_bytes|node_memory_wired_bytes|node_network_receive_bytes_total|node_network_receive_drop_total|node_network_receive_errs_total|node_network_receive_packets_total|node_network_transmit_bytes_total|node_network_transmit_drop_total|node_network_transmit_errs_total|node_network_transmit_packets_total|node_os_info|node_textfile_scrape_error|node_uname_info"
        action        = "keep"
    }
}
local.file_match "logs_integrations_integrations_node_exporter_direct_scrape" {
    path_targets = [{
        __address__ = "localhost",
        __path__    = "/var/log/*.log",
        instance    = constants.hostname,
        job         = "integrations/macos-node",
    }]
}
loki.process "logs_integrations_integrations_node_exporter_direct_scrape" {
    forward_to = [loki.write.grafana_cloud_loki.receiver]
    stage.multiline {
        firstline     = "^([\\w]{3} )?[\\w]{3} +[\\d]+ [\\d]+:[\\d]+:[\\d]+|[\\w]{4}-[\\w]{2}-[\\w]{2} [\\w]{2}:[\\w]{2}:[\\w]{2}(?:[+-][\\w]{2})?"
        max_lines     = 0
        max_wait_time = "10s"
    }
    stage.regex {
        expression = "(?P<timestamp>([\\w]{3} )?[\\w]{3} +[\\d]+ [\\d]+:[\\d]+:[\\d]+|[\\w]{4}-[\\w]{2}-[\\w]{2} [\\w]{2}:[\\w]{2}:[\\w]{2}(?:[+-][\\w]{2})?) (?P<hostname>\\S+) (?P<sender>.+?)\\[(?P<pid>\\d+)\\]:? (?P<message>(?s:.*))$"
    }
    stage.labels {
        values = {
            hostname = null,
            pid      = null,
            sender   = null,
        }
    }
    stage.match {
        selector = "{sender!=\"\", pid!=\"\"}"
        stage.template {
            source   = "message"
            template = "{{ .sender }}[{{ .pid }}]: {{ .message }}"
        }
        stage.label_drop {
            values = ["pid"]
        }
        stage.output {
            source = "message"
        }
    }
}
loki.source.file "logs_integrations_integrations_node_exporter_direct_scrape" {
    targets    = local.file_match.logs_integrations_integrations_node_exporter_direct_scrape.targets
    forward_to = [loki.process.logs_integrations_integrations_node_exporter_direct_scrape.receiver]
}`,
    logo: "https://storage.googleapis.com/grafanalabs-integration-logos/apple.svg",
  },
];
export default Examples;
