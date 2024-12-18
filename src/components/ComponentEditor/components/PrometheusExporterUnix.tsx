import { SelectableValue } from "@grafana/data";
import { InlineField, Input, InlineSwitch, MultiSelect } from "@grafana/ui";
import { Controller, useFormContext } from "react-hook-form";

const collectors = [
  {
    value: "arp",
    label: "arp",
    description: "Exposes ARP statistics from `/proc/net/arp`",
    enabled: true,
  },
  {
    value: "bcache",
    label: "bcache",
    description: "Exposes bcache statistics from `/sys/fs/bcache`",
    enabled: true,
  },
  {
    value: "bonding",
    label: "bonding",
    description:
      "Exposes the number of configured and active slaves of Linux bonding interfaces",
    enabled: true,
  },
  {
    value: "boottime",
    label: "boottime",
    description:
      "Exposes system boot time derived from the `kern.boottime sysctl`",
    enabled: true,
  },
  {
    value: "btrfs",
    label: "btrfs",
    description: "Exposes statistics on btrfs",
    enabled: true,
  },
  {
    value: "buddyinfo",
    label: "buddyinfo",
    description:
      "Exposes statistics of memory fragments as reported by `/proc/buddyinfo`",
    enabled: true,
  },
  {
    value: "conntrack",
    label: "conntrack",
    description:
      "Shows conntrack statistics (does nothing if no `/proc/sys/net/netfilter/` present)",
    enabled: true,
  },
  {
    value: "cpu",
    label: "cpu",
    description: "Exposes CPU statistics",
    enabled: true,
  },
  {
    value: "cpufreq",
    label: "cpufreq",
    description: "Exposes CPU frequency statistics",
    enabled: true,
  },
  {
    value: "devstat",
    label: "devstat",
    description: "Exposes device statistics",
    enabled: false,
  },
  {
    value: "diskstats",
    label: "diskstats",
    description: "Exposes disk I/O statistics",
    enabled: true,
  },
  {
    value: "dmi",
    label: "dmi",
    description: "Exposes DMI information",
    enabled: true,
  },
  {
    value: "drbd",
    label: "drbd",
    description:
      "Exposes Distributed Replicated Block Device statistics (to version 8.4)",
    enabled: false,
  },
  {
    value: "drm",
    label: "drm",
    description: "Exposes GPU card info from `/sys/class/drm/card?/device`",
    enabled: false,
  },
  {
    value: "edac",
    label: "edac",
    description: "Exposes error detection and correction statistics",
    enabled: true,
  },
  {
    value: "entropy",
    label: "entropy",
    description: "Exposes available entropy",
    enabled: true,
  },
  {
    value: "ethtool",
    label: "ethtool",
    description: "Exposes ethtool stats",
    enabled: false,
  },
  {
    value: "exec",
    label: "exec",
    description: "Exposes execution statistics",
    enabled: true,
  },
  {
    value: "fibrechannel",
    label: "fibrechannel",
    description: "Exposes FibreChannel statistics",
    enabled: true,
  },
  {
    value: "filefd",
    label: "filefd",
    description:
      "Exposes file descriptor statistics from `/proc/sys/fs/file-nr`",
    enabled: true,
  },
  {
    value: "filesystem",
    label: "filesystem",
    description: "Exposes filesystem statistics, such as disk space used",
    enabled: true,
  },
  {
    value: "hwmon",
    label: "hwmon",
    description:
      "Exposes hardware monitoring and sensor data from `/sys/class/hwmon`",
    enabled: true,
  },
  {
    value: "infiniband",
    label: "infiniband",
    description:
      "Exposes network statistics specific to InfiniBand and Intel OmniPath configurations",
    enabled: true,
  },
  {
    value: "interrupts",
    label: "interrupts",
    description: "Exposes detailed interrupts statistics",
    enabled: false,
  },
  {
    value: "ipvs",
    label: "ipvs",
    description:
      "Exposes IPVS status from `/proc/net/ip_vs` and stats from `/proc/net/ip_vs_stats`",
    enabled: true,
  },
  {
    value: "ksmd",
    label: "ksmd",
    description:
      "Exposes kernel and system statistics from `/sys/kernel/mm/ksm`",
    enabled: false,
  },
  {
    value: "lnstat",
    label: "lnstat",
    description: "Exposes Linux network cache stats",
    enabled: false,
  },
  {
    value: "loadavg",
    label: "loadavg",
    description: "Exposes load average",
    enabled: true,
  },
  {
    value: "logind",
    label: "logind",
    description: "Exposes session counts from logind",
    enabled: false,
  },
  {
    value: "mdadm",
    label: "mdadm",
    description:
      "Exposes statistics about devices in `/proc/mdstat` (does nothing if no `/proc/mdstat` present)",
    enabled: true,
  },
  {
    value: "meminfo",
    label: "meminfo",
    description: "Exposes memory statistics",
    enabled: true,
  },
  {
    value: "meminfo_numa",
    label: "meminfo_numa",
    description: "Exposes memory statistics from `/proc/meminfo_numa`",
    enabled: false,
  },
  {
    value: "mountstats",
    label: "mountstats",
    description:
      "Exposes filesystem statistics from `/proc/self/mountstats`.Exposes detailed NFS client statistics. ",
    enabled: false,
  },
  {
    value: "netclass",
    label: "netclass",
    description: "Exposes network interface info from `/sys/class/net`",
    enabled: true,
  },
  {
    value: "netdev",
    label: "netdev",
    description:
      "Exposes network interface statistics such as bytes transferred",
    enabled: true,
  },
  {
    value: "netisr",
    label: "netisr",
    description: "Exposes netisr statistics",
    enabled: true,
  },
  {
    value: "netstat",
    label: "netstat",
    description:
      "Exposes network statistics from `/proc/net/netstat`. This is the same information as `netstat -s`. ",
    enabled: true,
  },
  {
    value: "network_route",
    label: "network_route",
    description: "Exposes network route statistics",
    enabled: false,
  },
  {
    value: "nfs",
    label: "nfs",
    description:
      "Exposes NFS client statistics from `/proc/net/rpc/nfs`. This is the same information as `nfsstat -c`. ",
    enabled: true,
  },
  {
    value: "nfsd",
    label: "nfsd",
    description:
      "Exposes NFS kernel server statistics from `/proc/net/rpc/nfsd`. This is the same information as `nfsstat -s`. ",
    enabled: true,
  },
  {
    value: "ntp",
    label: "ntp",
    description: "Exposes local NTP daemon health to check time",
    enabled: false,
  },
  {
    value: "nvme",
    label: "nvme",
    description: "Exposes NVMe statistics",
    enabled: true,
  },
  {
    value: "os",
    label: "os",
    description: "Exposes os-release information",
    enabled: true,
  },
  {
    value: "perf",
    label: "perf",
    description:
      "Exposes perf based metrics (Warning: Metrics are dependent on kernel configuration and settings)",
    enabled: false,
  },
  {
    value: "powersupplyclass",
    label: "powersupplyclass",
    description: "Collects information on power supplies",
    enabled: true,
  },
  {
    value: "pressure",
    label: "pressure",
    description: "Exposes pressure stall statistics from `/proc/pressure/`",
    enabled: true,
  },
  {
    value: "processes",
    label: "processes",
    description: "Exposes aggregate process statistics from /proc",
    enabled: false,
  },
  {
    value: "qdisc",
    label: "qdisc",
    description: "Exposes queuing discipline statistics",
    enabled: false,
  },
  {
    value: "rapl",
    label: "rapl",
    description: "Exposes various statistics from `/sys/class/powercap`",
    enabled: true,
  },
  {
    value: "runit",
    label: "runit",
    description: "Exposes service status from runit",
    enabled: false,
  },
  {
    value: "schedstat",
    label: "schedstat",
    description: "Exposes task scheduler statistics from `/proc/schedstat`",
    enabled: true,
  },
  {
    value: "sockstat",
    label: "sockstat",
    description: "Exposes various statistics from `/proc/net/sockstat`",
    enabled: true,
  },
  {
    value: "softirqs",
    label: "softirqs",
    description: "Exposes detailed softirq statistics from `/proc/softirqs`",
    enabled: true,
  },
  {
    value: "softnet",
    label: "softnet",
    description: "Exposes statistics from `/proc/net/softnet_stat`",
    enabled: true,
  },
  {
    value: "stat",
    label: "stat",
    description:
      "Exposes various statistics from `/proc/stat`.This includes boot time, forks and interrupts. ",
    enabled: true,
  },
  {
    value: "supervisord",
    label: "supervisord",
    description: "Exposes service status from supervisord",
    enabled: false,
  },
  {
    value: "sysctl",
    label: "sysctl",
    description: "Expose sysctl values from `/proc/sys`",
    enabled: false,
  },
  {
    value: "systemd",
    label: "systemd",
    description: "Exposes service and system status from systemd",
    enabled: false,
  },
  {
    value: "tapestats",
    label: "tapestats",
    description: "Exposes tape device stats",
    enabled: true,
  },
  {
    value: "tcpstat",
    label: "tcpstat",
    description:
      "Exposes TCP connection status information from `/proc/net/tcp` and `/proc/net/tcp6`.(Warning: The current version has potential performance issues in high load situations.) ",
    enabled: false,
  },
  {
    value: "textfile",
    label: "textfile",
    description:
      "Collects metrics from files in a directory matching the filename pattern `*.prom`.The files must be using the text format defined here: https://prometheus.io/docs/instrumenting/exposition_formats/. ",
    enabled: true,
  },
  {
    value: "thermal",
    label: "thermal",
    description: "Exposes thermal statistics",
    enabled: true,
  },
  {
    value: "thermal_zone",
    label: "thermal_zone",
    description:
      "Exposes thermal zone & cooling device statistics from `/sys/class/thermal`",
    enabled: true,
  },
  {
    value: "time",
    label: "time",
    description: "Exposes the current system time",
    enabled: true,
  },
  {
    value: "timex",
    label: "timex",
    description: "Exposes selected `adjtimex(2)` system call stats",
    enabled: true,
  },
  {
    value: "udp_queues",
    label: "udp_queues",
    description:
      "Exposes UDP total lengths of the `rx_queue` and `tx_queue` from `/proc/net/udp` and `/proc/net/udp6`",
    enabled: true,
  },
  {
    value: "uname",
    label: "uname",
    description:
      "Exposes system information as provided by the uname system call",
    enabled: true,
  },
  {
    value: "vmstat",
    label: "vmstat",
    description: "Exposes statistics from `/proc/vmstat`",
    enabled: true,
  },
  {
    value: "wifi",
    label: "wifi",
    description: "Exposes WiFi device and station statistics",
    enabled: false,
  },
  {
    value: "xfs",
    label: "xfs",
    description: "Exposes XFS runtime statistics",
    enabled: true,
  },
  {
    value: "zfs",
    label: "zfs",
    description: "Exposes ZFS performance statistics",
    enabled: true,
  },
  {
    value: "zoneinfo",
    label: "zoneinfo",
    description: "Exposes zone stats",
    enabled: false,
  },
];

const Component = () => {
  const commonOptions = {
    labelWidth: 25,
  };
  const { register, control } = useFormContext();
  return (
    <>
      <h6>Basic Settings</h6>
      <InlineField
        label="Set collectors"
        tooltip="Overrides the default set of enabled collectors with the collectors listed."
        {...commonOptions}
      >
        <Controller
          name="set_collectors"
          render={({ field: { ref, ...field } }) => (
            <MultiSelect width={25} {...field} options={collectors} />
          )}
          control={control}
        />
      </InlineField>
      <InlineField
        label="Enable collectors"
        tooltip="	Collectors to mark as enabled in addition to the default set."
        {...commonOptions}
      >
        <Controller
          name="enable_collectors"
          render={({ field: { ref, ...field } }) => (
            <MultiSelect
              width={25}
              {...field}
              options={collectors.filter((c) => !c.enabled)}
            />
          )}
          control={control}
        />
      </InlineField>
      <InlineField
        label="Disable collectors"
        tooltip="	Collectors from the default set to mark as disabled."
        {...commonOptions}
      >
        <Controller
          name="disable_collectors"
          render={({ field: { ref, ...field } }) => (
            <MultiSelect
              width={25}
              {...field}
              options={collectors.filter((c) => c.enabled)}
            />
          )}
          control={control}
        />
      </InlineField>
      <InlineField
        label="Include exporter metrics"
        tooltip="Whether metrics about the exporter itself should be reported."
        {...commonOptions}
      >
        <InlineSwitch {...register("include_exporter_metrics")} />
      </InlineField>
      <InlineField
        label="ProcFS Path"
        tooltip="The ProcFS mountpoint."
        {...commonOptions}
      >
        <Input {...register("procfs_path")} placeholder="/proc" />
      </InlineField>
      <InlineField
        label="SysFS Path"
        tooltip="The SysFS mountpoint."
        {...commonOptions}
      >
        <Input {...register("sysfs_path")} placeholder="/sys" />
      </InlineField>
      <InlineField
        label="Root Path"
        tooltip="The root mountpoint."
        {...commonOptions}
      >
        <Input {...register("rootfs_path")} placeholder="/" />
      </InlineField>
    </>
  );
};

const PrometheusExporterUnix = {
  preTransform(data: Record<string, any>): Record<string, any> {
    return data;
  },
  postTransform(data: Record<string, any>): Record<string, any> {
    if (
      Array.isArray(data["set_collectors"]) &&
      typeof data["set_collectors"][0] === "object"
    )
      data["set_collectors"] = data["set_collectors"]?.map(
        (x: SelectableValue) => x.value,
      );
    if (
      Array.isArray(data["enable_collectors"]) &&
      typeof data["enable_collectors"][0] === "object"
    )
      data["enable_collectors"] = data["enable_collectors"]?.map(
        (x: SelectableValue) => x.value,
      );
    if (
      Array.isArray(data["disable_collectors"]) &&
      typeof data["disable_collectors"][0] === "object"
    )
      data["disable_collectors"] = data["disable_collectors"]?.map(
        (x: SelectableValue) => x.value,
      );
    return data;
  },
  Component,
};

export default PrometheusExporterUnix;
