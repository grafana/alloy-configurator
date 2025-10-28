import ReactDOM from "react-dom/client";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import App from "./App";
import { ThemeProvider } from "./theme";
import { ComponentProvider, ModelProvider } from "./state";
import { getWebInstrumentations, initializeFaro } from "@grafana/faro-web-sdk";
import { TracingInstrumentation } from "@grafana/faro-web-tracing";
import { ReactIntegration } from "@grafana/faro-react";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <ThemeProvider>
    <ModelProvider>
      <ComponentProvider>
        <App />
      </ComponentProvider>
    </ModelProvider>
  </ThemeProvider>,
);
if (process.env.REACT_APP_FARO_URL) {
  initializeFaro({
    url: process.env.REACT_APP_FARO_URL,
    app: {
      name: "Alloy Configurator",
      version: "0.1.0",
      environment: process.env.NODE_ENV,
    },
    instrumentations: [
      ...getWebInstrumentations({
        captureConsole: true,
      }),
      new TracingInstrumentation(),
      new ReactIntegration(),
    ],
  });
  // eslint-disable-next-line no-console
  console.info("Faro was initialized");
}
