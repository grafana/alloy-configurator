import { SelectableValue } from "@grafana/data";
import { InlineField, MultiSelect } from "@grafana/ui";
import { Controller, useFormContext } from "react-hook-form";
import TypedInput from "../inputs/TypedInput";

const collectors = [
  { label: "ad", value: "ad", description: "Active Directory Domain Services" },
  {
    label: "adcs",
    value: "adcs",
    description: "Active Directory Certificate Services",
  },
  {
    label: "adfs",
    value: "adfs",
    description: "Active Directory Federation Services",
  },
  { label: "cache", value: "cache", description: "Cache metrics" },
  { label: "cpu", value: "cpu", description: "CPU usage" },
  { label: "cpu_info", value: "cpu_info", description: "CPU Information" },
  {
    label: "cs",
    value: "cs",
    description:
      "“Computer System” metrics (system properties, num cpus/total memory)",
  },
  { label: "container", value: "container", description: "Container metrics" },
  { label: "dfsr", value: "dfsr", description: "DFSR metrics" },
  { label: "dhcp", value: "dhcp", description: "DHCP Server" },
  { label: "dns", value: "dns", description: "DNS Server" },
  { label: "exchange", value: "exchange", description: "Exchange metrics" },
  {
    label: "fsrmquota",
    value: "fsrmquota",
    description:
      "Microsoft File Server Resource Manager (FSRM) Quotas collector",
  },
  { label: "hyperv", value: "hyperv", description: "Hyper-V hosts" },
  { label: "iis", value: "iis", description: "IIS sites and applications" },
  {
    label: "logical_disk",
    value: "logical_disk",
    description: "Logical disks, disk I/O",
  },
  { label: "logon", value: "logon", description: "User logon sessions" },
  { label: "memory", value: "memory", description: "Memory usage metrics" },
  {
    label: "mscluster_cluster",
    value: "mscluster_cluster",
    description: "MSCluster cluster metrics",
  },
  {
    label: "mscluster_network",
    value: "mscluster_network",
    description: "MSCluster network metrics",
  },
  {
    label: "mscluster_node",
    value: "mscluster_node",
    description: "MSCluster Node metrics",
  },
  {
    label: "mscluster_resource",
    value: "mscluster_resource",
    description: "MSCluster Resource metrics",
  },
  {
    label: "mscluster_resourcegroup",
    value: "mscluster_resourcegroup",
    description: "MSCluster ResourceGroup metrics",
  },
  { label: "msmq", value: "msmq", description: "MSMQ queues" },
  {
    label: "mssql",
    value: "mssql",
    description: "SQL Server Performance Objects metrics",
  },
  {
    label: "netframework_clrexceptions",
    value: "netframework_clrexceptions",
    description: ".NET Framework CLR Exceptions",
  },
  {
    label: "netframework_clrinterop",
    value: "netframework_clrinterop",
    description: ".NET Framework Interop Metrics",
  },
  {
    label: "netframework_clrjit",
    value: "netframework_clrjit",
    description: ".NET Framework JIT metrics",
  },
  {
    label: "netframework_clrloading",
    value: "netframework_clrloading",
    description: ".NET Framework CLR Loading metrics",
  },
  {
    label: "netframework_clrlocksandthreads",
    value: "netframework_clrlocksandthreads",
    description: ".NET Framework locks and metrics threads",
  },
  {
    label: "netframework_clrmemory",
    value: "netframework_clrmemory",
    description: ".NET Framework Memory metrics",
  },
  {
    label: "netframework_clrremoting",
    value: "netframework_clrremoting",
    description: ".NET Framework Remoting metrics",
  },
  {
    label: "netframework_clrsecurity",
    value: "netframework_clrsecurity",
    description: ".NET Framework Security Check metrics",
  },
  { label: "net", value: "net", description: "Network interface I/O" },
  {
    label: "os",
    value: "os",
    description: "OS metrics (memory, processes, users)",
  },
  { label: "process", value: "process", description: "Per-process metrics" },
  {
    label: "remote_fx",
    value: "remote_fx",
    description: "RemoteFX protocol (RDP) metrics",
  },
  {
    label: "scheduled_task",
    value: "scheduled_task",
    description: "Scheduled Tasks metrics",
  },
  { label: "service", value: "service", description: "Service state metrics" },
  { label: "smtp", value: "smtp", description: "IIS SMTP Server" },
  { label: "system", value: "system", description: "System calls" },
  { label: "tcp", value: "tcp", description: "TCP connections" },
  {
    label: "teradici_pcoip",
    value: "teradici_pcoip",
    description: "Teradici PCoIP session metrics",
  },
  { label: "time", value: "time", description: "Windows Time Service" },
  {
    label: "thermalzone",
    value: "thermalzone",
    description: "Thermal information",
  },
  {
    label: "terminal_services",
    value: "terminal_services",
    description: "Terminal services (RDS)",
  },
  {
    label: "textfile",
    value: "textfile",
    description: "Read prometheus metrics from a text file",
  },
  {
    label: "vmware_blast",
    value: "vmware_blast",
    description: "VMware Blast session metrics",
  },
  {
    label: "vmware",
    value: "vmware",
    description: "Performance counters installed by the Vmware Guest agent",
  },
];

const Component = () => {
  const { control } = useFormContext();
  const commonOptions = {
    labelWidth: 25,
  };
  return (
    <>
      <h6>Basic Settings</h6>
      <InlineField
        label="Enabled collectors"
        tooltip="List of collectors to enable."
        {...commonOptions}
      >
        <Controller
          name="enabled_collectors"
          render={({ field: { ref, ...field } }) => (
            <MultiSelect width={25} {...field} options={collectors} />
          )}
          control={control}
        />
      </InlineField>
      <InlineField
        label="Timeout"
        tooltip="Configure timeout for collecting metrics."
        {...commonOptions}
      >
        <TypedInput name="timeout" control={control} />
      </InlineField>
    </>
  );
};

const PrometheusExporterWindows = {
  preTransform(data: Record<string, any>): Record<string, any> {
    return data;
  },
  postTransform(data: Record<string, any>): Record<string, any> {
    if (
      Array.isArray(data["enabled_collectors"]) &&
      typeof data["enabled_collectors"][0] === "object"
    )
      data["enabled_collectors"] = data["enabled_collectors"]?.map(
        (x: SelectableValue) => x.value,
      );
    return data;
  },
  Component,
};

export default PrometheusExporterWindows;
