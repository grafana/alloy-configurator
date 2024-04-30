import { css } from "@emotion/css";
import { useStyles } from "../../theme";
import { GrafanaTheme2 } from "@grafana/data";
import { useModelContext } from "../../state";
import { Button, HorizontalGroup, Tooltip } from "@grafana/ui";
import { useState } from "react";

const InstallationInstructions = () => {
  const styles = useStyles(getStyles);
  const { model } = useModelContext();

  const [copied, setCopied] = useState(false);
  const downloadFile = () => {
    const el = document.createElement("a");
    el.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(model),
    );
    el.setAttribute("download", "config.alloy");
    el.style.display = "none";
    document.body.appendChild(el);
    el.click();
    document.body.removeChild(el);
  };
  const copyBase64 = () => {
    navigator.clipboard.writeText(`echo "${btoa(model)}" | base64 -d `);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 5 * 1000);
  };

  return (
    <div className={styles.container}>
      <h4>Quick Setup</h4>
      <ol className={styles.instructionsList}>
        <li>
          <h5>
            Follow the{" "}
            <a
              href="https://grafana.com/docs/alloy/latest/get-started/install/"
              target="_blank"
              rel="noreferrer"
            >
              installation instructions
            </a>{" "}
            for your system
          </h5>
        </li>
        <li>
          <h5>Copy the configuration file contents to the desired location</h5>
          <HorizontalGroup>
            <Button fill="outline" onClick={downloadFile}>
              Download Configuration File
            </Button>
            <Tooltip
              content={
                <span>
                  Copy as a command in the form of{" "}
                  <code>echo "..." | base64 -d </code>
                </span>
              }
            >
              <Button variant="secondary" fill="outline" onClick={copyBase64}>
                {copied && "Copied"}
                {!copied && "Copy as Base64 command"}
              </Button>
            </Tooltip>
          </HorizontalGroup>
          <p>The default configuration file for flow mode is located at:</p>
          <p>
            <ul>
              <li>
                Linux: <code>/etc/alloy/config.alloy</code>
              </li>
              <li>
                macOS: <code>$(brew --prefix)/etc/alloy/config.alloy</code>
              </li>
              <li>
                Windows:{" "}
                <code>%PROGRAMFILES%\GrafanaLabs\Alloy\config.alloy</code>
              </li>
            </ul>
          </p>
          <p>
            If you are using environment variables in your configuration, make
            sure these are present as well. Depending on the features you use,
            you might also need to add{" "}
            <code>--stability.level=public-preview</code> to your{" "}
            <code>alloy run</code> command. Instructions for accomplishing this
            can be found in the{" "}
            <a
              href="https://grafana.com/docs/alloy/latest/tasks/configure/"
              target="_blank"
              rel="noreferrer"
            >
              configuration documentation
            </a>
            .
          </p>
        </li>
        <li>
          <h5>(Re-)Start Alloy</h5>
          <p>
            Instructions for your system can be found in{" "}
            <a
              href="https://grafana.com/docs/alloy/latest/get-started/run/"
              rel="noreferrer"
              target="_blank"
            >
              the documentation
            </a>
          </p>
        </li>
      </ol>
    </div>
  );
};

const getStyles = (theme: GrafanaTheme2) => {
  return {
    container: css`
      width: 80vw;
      display: block;
      border: rgba(204, 204, 220, 0.07) solid 1px;
      background-color: ${theme.colors.background.secondary};
      border-radius: 2px;
      padding: ${theme.spacing(2, 2)};
    `,
    instructionsList: css`
      margin-left: 24px;
      margin-bottom: 40px;
      padding: 0;
      font-weight: 500;
      font-size: 1.2rem;
      li {
        h5 {
          font-weight: 500;
          font-size: 1.2rem;
        }
        p {
          font-size: 1rem;
        }
      }
    `,
  };
};

export default InstallationInstructions;
