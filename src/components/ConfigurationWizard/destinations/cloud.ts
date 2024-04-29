export const CloudDestination = (stackName?: string) => {
  return {
    metrics: {
      enabled: true,
      receiver: "grafana_cloud.stack.receivers.metrics",
    },
    logs: {
      enabled: true,
      receiver: "grafana_cloud.stack.receivers.logs",
    },
    traces: {
      enabled: true,
      receiver: "grafana_cloud.stack.receivers.traces",
    },
    profiles: {
      enabled: true,
      receiver: "grafana_cloud.stack.receivers.profiles",
    },
    template(): string {
      return `import.git "grafana_cloud" {
  repository = "https://github.com/grafana/alloy-modules.git"
  revision = "main"
  path = "modules/cloud/grafana/cloud/module.alloy"
  pull_frequency = "24h"
}

grafana_cloud.stack "receivers" {
  stack_name = "${!!stackName ? stackName : "stackName"}"
  token = env("GRAFANA_CLOUD_TOKEN")
}
`;
    },
  };
};
