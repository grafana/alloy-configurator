import {
  Form,
  Field,
  Input,
  Button,
  FormAPI,
  HorizontalGroup,
} from "@grafana/ui";
import { faro } from "@grafana/faro-web-sdk";
import { Block, toBlock } from "../../lib/river";
import PrometheusRemoteWrite from "./components/PrometheusRemoteWrite";
import PrometheusExporterRedis from "./components/PrometheusExporterRedis";
import PrometheusScrape from "./components/PrometheusScrape";
import UnsupportedComponent from "./components/UnsupportedComponent";
import PrometheusExporterMysql from "./components/PrometheusExporterMysql";
import PrometheusExporterGithub from "./components/PrometheusExporterGithub";
import DiscoveryEc2 from "./components/DiscoveryEc2";
import { KnownComponents } from "../../lib/components";
import OTelColReceiverOTLP from "./components/OTelColReceiverOTLP";
import { useStyles } from "../../theme";
import { css } from "@emotion/css";
import { GrafanaTheme2 } from "@grafana/data";
import OTelColProcessorBatch from "./components/OTelColProcessorBatch";
import OTelColExporterPrometheus from "./components/OTelColExporterPrometheus";
import OTelColExporterLoki from "./components/OTelColExporterLoki";
import PrometheusExporterUnix from "./components/PrometheusExporterUnix";
import LokiSourceFile from "./components/LokiSourceFile";
import LokiRelabel from "./components/LokiRelabel";
import LokiSourceJournal from "./components/LokiSourceJournal";
import PrometheusRelabel from "./components/PrometheusRelabel";
import LocalFileMatch from "./components/LocalFileMatch";
import DiscoveryKubernetes from "./components/DiscoveryKubernetes";
import DiscoveryRelabel from "./components/DiscoveryRelabel";
import PyroscopeScrape from "./components/PyroscopeScrape";
import LokiWrite from "./components/LokiWrite";
import LokiSourceWindowsEvent from "./components/LokiSourceWindowsEvent";
import PrometheusExporterWindows from "./components/PrometheusExporterWindows";
import LokiProcess from "./components/LokiProcess";
import { useComponentContext } from "../../state";
import ImportGit from "./components/ImportGit";

interface ComponentEditorProps {
  updateComponent: (component: Block) => void;
  discard: () => void;
  component: Block;
}
const ComponentEditor = ({
  updateComponent,
  component,
  discard,
}: ComponentEditorProps) => {
  const styles = useStyles(getStyles);
  const { imports } = useComponentContext();

  const {
    Component,
    preTransform,
    postTransform,
  }: {
    Component: ({
      methods,
    }: {
      methods: FormAPI<Record<string, any>>;
    }) => JSX.Element;
    preTransform: (data: Record<string, any>) => Record<string, any>;
    postTransform: (data: Record<string, any>) => Record<string, any>;
  } = (() => {
    faro.api?.pushEvent("edit_component", {
      component: component.name,
    });
    const id = (data: any) => data;
    switch (component.name) {
      case "discovery.ec2":
        return {
          Component: DiscoveryEc2,
          postTransform: id,
          preTransform: id,
        };
      case "prometheus.remote_write":
        return PrometheusRemoteWrite;
      case "prometheus.exporter.redis":
        return {
          Component: PrometheusExporterRedis,
          postTransform: id,
          preTransform: id,
        };
      case "prometheus.scrape":
        return PrometheusScrape;
      case "prometheus.exporter.mysql":
        return {
          Component: PrometheusExporterMysql,
          postTransform: id,
          preTransform: id,
        };
      case "prometheus.exporter.github":
        return {
          Component: PrometheusExporterGithub,
          postTransform: id,
          preTransform: id,
        };
      case "otelcol.receiver.otlp":
        return OTelColReceiverOTLP;
      case "otelcol.processor.batch":
        return OTelColProcessorBatch;
      case "otelcol.exporter.prometheus":
        return OTelColExporterPrometheus;
      case "otelcol.exporter.loki":
        return OTelColExporterLoki;
      case "prometheus.exporter.unix":
        return PrometheusExporterUnix;
      case "prometheus.exporter.windows":
        return PrometheusExporterWindows;
      case "local.file_match":
        return LocalFileMatch;
      case "loki.write":
        return LokiWrite;
      case "loki.source.file":
        return LokiSourceFile;
      case "loki.source.journal":
        return LokiSourceJournal;
      case "loki.source.windowsevent":
        return LokiSourceWindowsEvent;
      case "loki.relabel":
        return LokiRelabel;
      case "loki.process":
        return LokiProcess;
      case "prometheus.relabel":
        return PrometheusRelabel;
      case "discovery.kubernetes":
        return DiscoveryKubernetes;
      case "discovery.relabel":
        return DiscoveryRelabel;
      case "pyroscope.scrape":
        return PyroscopeScrape;
      case "import.git":
        return ImportGit;
      default:
        const moduleEditor = imports[component.name]?.componentForm;
        if (moduleEditor) {
          return moduleEditor;
        }
        faro.api?.pushEvent("edit_unsupported", { component: component.name });
        return {
          Component: UnsupportedComponent,
          postTransform: id,
          preTransform: id,
        };
    }
  })();

  let spec = KnownComponents[component.name]
    ? KnownComponents[component.name]
    : imports[component.name];
  let formValues = component.formValues(spec);
  formValues = preTransform(formValues);
  if (spec && spec.multi) formValues["label"] = component.label;

  return (
    <Form
      onSubmit={({ label, ...args }) => {
        const transformed = postTransform(args);
        updateComponent(
          toBlock(
            component.name,
            transformed,
            label,
            KnownComponents[component.name],
          )!,
        );
      }}
      defaultValues={formValues}
      className={styles.form}
    >
      {(methods) => {
        const { register, errors } = methods;
        return (
          <>
            {spec && spec.multi && (
              <Field
                label="Label"
                description="Component Label"
                invalid={!!errors["label"]}
                error="A label is required"
              >
                <Input {...register("label", { required: true })} />
              </Field>
            )}
            <Component methods={methods} />
            <HorizontalGroup>
              <Button type="submit">Save</Button>
              <Button onClick={discard} variant="secondary">
                Discard
              </Button>
            </HorizontalGroup>
          </>
        );
      }}
    </Form>
  );
};

const getStyles = (theme: GrafanaTheme2) => {
  return {
    form: css`
      width: 100%;
    `,
  };
};

export default ComponentEditor;
