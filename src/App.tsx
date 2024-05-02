import { css } from "@emotion/css";
import { GrafanaTheme2 } from "@grafana/data";
import { useStyles } from "./theme";
import {
  Alert,
  LinkButton,
  Button,
  Modal,
  Input,
  Icon,
  Tooltip,
  VerticalGroup,
  Badge,
} from "@grafana/ui";
import Header from "./components/Header";
import ConfigEditor from "./components/ConfigEditor";
import { useState, useMemo } from "react";
import ExamplesCatalog from "./components/ExamplesCatalog";
import { useModelContext } from "./state";
import InstallationInstructions from "./components/InstallationInstructions";
import ConfigurationWizard from "./components/ConfigurationWizard";
import Converter from "./components/Converter";
import GraphPanel from "./components/GraphPanel";

function App() {
  const styles = useStyles(getStyles);
  const [wizardOpen, setWizardOpen] = useState(false);
  const openWizard = () => setWizardOpen(true);
  const closeWizard = () => setWizardOpen(false);
  const [examplesCatalogOpen, setExamplesCatalogOpen] = useState(false);
  const openExamples = () => setExamplesCatalogOpen(true);
  const closeExamples = () => setExamplesCatalogOpen(false);
  const [converterOpen, setConverterOpen] = useState(false);
  const openConverter = () => setConverterOpen(true);
  const closeConverter = () => setConverterOpen(false);
  const [graphOpen, setGraphOpen] = useState(false);
  const openGraph = () => setGraphOpen(true);
  const closeGraph = () => setGraphOpen(false);
  const { model } = useModelContext();
  const [copied, setCopied] = useState(false);

  const converterEnabled = !!process.env.REACT_APP_CONVERT_ENDPOINT;

  const shareLink = useMemo(
    () => `${window.location}?c=${btoa(model)}`,
    [model],
  );

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 5 * 1000);
  };

  return (
    <div className={styles.container}>
      <Header></Header>
      <section className={styles.firstSection}>
        <div className={styles.hero}>
          <h1>Welcome to the Grafana Alloy Configuration Generator</h1>
          <p>
            This tool allows for easy configuration of Grafana Alloy. To get
            started click on <code>Add Component</code> in the editor below
          </p>
          <hr />
          <VerticalGroup>
            <p>
              If this is your first time working with the Alloy, we recommend
              you use the configuration wizard or get started with an example
              configuration, based on your usecase.
            </p>
            <div className={styles.buttonBar}>
              <Button onClick={openWizard} variant="primary">
                Start configuration wizard
              </Button>
              {converterEnabled && (
                <Button onClick={openConverter} variant="secondary">
                  <Badge text="New" icon="rocket" color="green" />
                  Convert your existing configuration
                </Button>
              )}
              <Button onClick={openExamples} variant="secondary">
                Open examples catalog
              </Button>
              <LinkButton
                variant="secondary"
                href="https://grafana.com/docs/alloy/latest/"
                target="_blank"
                icon="external-link-alt"
              >
                View Alloy Docs
              </LinkButton>
              <div
                className={css`
                  flex-grow: 1;
                `}
              ></div>
              <Button onClick={openGraph} variant="secondary" icon="sitemap">
                Visualize
              </Button>
            </div>
          </VerticalGroup>
        </div>
      </section>
      <section className={styles.section}>
        <div className={styles.editorWindow}>
          <ConfigEditor />
        </div>
      </section>
      <section className={styles.section}>
        <div className={styles.shareSection}>
          <h4>Share this Configuration</h4>
          <p>To share this configuration, use the following link:</p>
          <VerticalGroup>
            <Input
              value={shareLink}
              readOnly
              addonAfter={
                <Tooltip
                  content={(copied ? "Copied" : "Copy") + " link to clipboard"}
                >
                  <Button variant="secondary" onClick={copyLink}>
                    <Icon name={copied ? "check" : "copy"} />
                  </Button>
                </Tooltip>
              }
            />
            <Alert
              severity="warning"
              title="By copying the link to your clipboard you may be unintentionally sharing sensitive data. Check the included information before copying and ensure that you avoid sharing confidential data like secrets or API-Tokens"
            ></Alert>
          </VerticalGroup>
        </div>
      </section>
      <section className={styles.section}>
        <InstallationInstructions />
      </section>
      <Modal
        title="Configuration Wizard"
        isOpen={wizardOpen}
        onDismiss={closeWizard}
        className={styles.wizardModal}
      >
        <ConfigurationWizard dismiss={closeWizard} />
      </Modal>
      <Modal
        title="Examples Catalog"
        isOpen={examplesCatalogOpen}
        onDismiss={closeExamples}
      >
        <ExamplesCatalog dismiss={closeExamples} />
      </Modal>
      <Modal
        title="Configuration Converter"
        isOpen={converterOpen}
        onDismiss={closeConverter}
      >
        <Converter dismiss={closeConverter} />
      </Modal>
      <Modal
        title="Visualization"
        isOpen={graphOpen}
        onDismiss={closeGraph}
        className={styles.wizardModal}
      >
        <GraphPanel />
      </Modal>
    </div>
  );
}

const getStyles = (theme: GrafanaTheme2) => {
  return {
    section: css`
      width: 100%;
      padding-top: 20px;
      display: flex;
      justify-content: center;
    `,
    firstSection: css`
      width: 100%;
      padding-top: 20px;
      display: flex;
      justify-content: center;
      margin-top: 81px;
    `,
    content: css`
      width: 80vw;
      display: flex;
      flex-wrap: nowrap;
      flex-direction: row;
      justify-content: space-between;
      gap: 10px;
    `,
    shareSection: css`
      width: 80vw;
      display: block;
      border: rgba(204, 204, 220, 0.07) solid 1px;
      background-color: ${theme.colors.background.secondary};
      border-radius: 2px;
      padding: ${theme.spacing(2, 2)};
    `,
    editorWindow: css`
      height: 60vh;
      width: 80vw;
      padding: 10px;
      border: rgba(204, 204, 220, 0.07) solid 1px;
      border-radius: 2px;
      background-color: ${theme.colors.background.secondary};
    `,
    container: css`
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
      background: ${theme.colors.background.primary};
      font-family: Inter, Helvetica, Arial, sans-serif;
      min-height: 100vh;
      justify-content: flex-start;
      padding-bottom: 10em;
    `,
    hero: css`
      width: 80vw;
    `,
    split: css`
      display: flex;
      gap: 2rem;
    `,
    splitLeft: css`
      height: 5rem;
    `,
    wizardModal: css`
      min-width: 50%;
    `,
    buttonBar: css`
      display: flex;
      gap: 0.5rem;
      width: 100%;
    `,
  };
};

export default App;
