import React, { useCallback, useContext, useState } from "react";
import Parser from "web-tree-sitter";
import { ComponentType, KnownModules } from "./lib/components";
import { Attribute, Block } from "./lib/river";

export type Component = { block: Block; node: Parser.SyntaxNode };

const ComponentContext = React.createContext<{
  components: Component[];
  imports: Record<string, ComponentType>;
  setComponents: (b: Component[]) => Record<string, ComponentType>;
}>({
  components: [],
  imports: {},
  setComponents: (_: Component[]) => {
    return {};
  },
});

// Component provider
export const ComponentProvider = ({ children }: React.PropsWithChildren) => {
  const [components, setComponentsState] = useState<Component[]>([]);
  const [imports, setImports] = useState<Record<string, ComponentType>>({});
  // Remember to pass the state and the updater function to the provider
  const setComponents = useCallback(
    (components: Component[]) => {
      setComponentsState(components);
      const imports: Record<string, ComponentType> = {};
      for (const c of components) {
        if (c.block.name === "import.git" && c.block.label) {
          const repo = c.block.attributes.find(
            (x) => x.name === "repository",
          ) as Attribute | null;
          const path = c.block.attributes.find(
            (x) => x.name === "path",
          ) as Attribute | null;
          if (!path || !repo) continue;
          const module = KnownModules[repo.value]?.[path.value];
          if (!module) continue;
          for (const component of Object.keys(module.exports)) {
            imports[`${c.block.label}.${component}`] =
              module.exports[component];
          }
        }
      }
      setImports(imports);
      return imports;
    },
    [setImports, setComponentsState],
  );
  return (
    <ComponentContext.Provider value={{ components, imports, setComponents }}>
      {children}
    </ComponentContext.Provider>
  );
};

export function useComponentContext() {
  const context = useContext(ComponentContext);
  if (!context) {
    throw new Error(
      "useComponentContext must be used within the ComponentProvider",
    );
  }
  return context;
}

const ModelContext = React.createContext<{
  model: string;
  setModel: (m: string) => void;
}>({ model: "", setModel: (_: string) => { } });

// Model provider
export const ModelProvider = ({ children }: React.PropsWithChildren) => {
  const urlModel = new URLSearchParams(document.location.search).get("c");
  const localStorageModel = localStorage.getItem("config.alloy");
  let initialModel = "";
  const base64ToBytes = (data: string) => {
    const binString = atob(decodeURIComponent(data));
    return Uint8Array.from(binString, (m) => m.codePointAt(0) ?? 0);
  };
  if (urlModel)
    initialModel = new TextDecoder().decode(base64ToBytes(urlModel));
  else if (localStorageModel) initialModel = localStorageModel;
  if (initialModel === "") {
    initialModel = `// Welcome to the Grafana Alloy Configurator!
// You can paste your configuration here or start by using the configuration wizard or by loading an example from the catalog.

`;
  }
  window.history.replaceState(null, "", window.location.pathname);
  const [model, setModel] = useState<string>(initialModel);
  // Remember to pass the state and the updater function to the provider
  return (
    <ModelContext.Provider value={{ model, setModel }}>
      {children}
    </ModelContext.Provider>
  );
};

export function useModelContext() {
  const context = useContext(ModelContext);
  if (!context) {
    throw new Error("useModelContext must be used within the ModelProvider");
  }
  return context;
}
