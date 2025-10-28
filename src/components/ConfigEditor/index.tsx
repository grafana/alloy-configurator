import Editor, { Monaco } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import { useCallback, useMemo, useRef, useState, useEffect } from "react";
import { Button, Drawer, HorizontalGroup, LinkButton } from "@grafana/ui";

import Parser from "web-tree-sitter";

import { Theme, useStyles, useTheme } from "../../theme";
import ComponentList from "../ComponentList";
import ComponentEditor from "../ComponentEditor";
import * as River from "../../lib/river";
import { useComponentContext, Component, useModelContext } from "../../state";
import { css } from "@emotion/css";
import { GrafanaTheme2 } from "@grafana/data";
import { markersFor } from "../../lib/componentaddons";
import { ComponentType } from "../../lib/components";

const defaultOpts: monaco.editor.IStandaloneEditorConstructionOptions = {
  fontSize: 15,
  minimap: { enabled: false },
  scrollbar: {
    vertical: "hidden",
    horizontal: "hidden",
  },
};

type SelectedComponent = {
  component: River.Block;
  node: Parser.SyntaxNode | null;
};

const findErrors = (cursor: Parser.TreeCursor, level = 0) => {
  if (!cursor.currentNode().hasError) return [];
  let errs: monaco.editor.IMarkerData[] = [];
  while (true) {
    const n = cursor.currentNode();
    if (cursor.nodeType === "ERROR") {
      errs.push({
        message: "unable to parse",
        severity: monaco.MarkerSeverity.Error,
        startLineNumber: n.startPosition.row + 1,
        startColumn: n.startPosition.column,
        endLineNumber: n.endPosition.row + 1,
        endColumn: n.endPosition.column + 1,
      });
    }
    if (cursor.nodeIsMissing) {
      errs.push({
        message: "Missing " + n.type,
        severity: monaco.MarkerSeverity.Error,
        startLineNumber: n.startPosition.row + 1,
        startColumn: n.startPosition.column,
        endLineNumber: n.endPosition.row + 1,
        endColumn: n.endPosition.column + 1,
      });
    }
    if (cursor.gotoFirstChild()) {
      errs = errs.concat(findErrors(cursor, level + 1));
      cursor.gotoParent();
    }
    if (!cursor.gotoNextSibling()) break;
  }
  return errs;
};

const provideInfoMarkers = (
  components: { node: Parser.SyntaxNode; block: River.Block }[],
  imports: Record<string, ComponentType>,
): monaco.editor.IMarkerData[] => {
  return components.flatMap((c) => {
    return markersFor(c.node, c.block, imports);
  }, []);
};

const ConfigEditor = () => {
  const { setComponents } = useComponentContext();
  const { model, setModel } = useModelContext();
  const editorRef = useRef<null | monaco.editor.IStandaloneCodeEditor>(null);
  const monacoRef = useRef<null | Monaco>(null);
  const parserRef = useRef<null | { parser: Parser; river: Parser.Language }>(
    null,
  );
  const commandRef = useRef<null | {
    addComponent: string;
    editComponent: string;
  }>(null);

  const componentsRef = useRef<Component[]>([]);

  const styles = useStyles(getStyles);

  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [parsingTime, setParsingTime] = useState("0");
  const [currentComponent, setCurrentComponent] =
    useState<SelectedComponent | null>(null);

  const theme = useTheme();
  const editorTheme = useMemo(
    () =>
      theme.name.toLowerCase() === Theme.dark ? "thema-dark" : "thema-light",
    [theme],
  );

  const parseComponents = useCallback(() => {
    if (!parserRef.current) return;
    const { parser, river } = parserRef.current;
    const start = performance.now();
    const tree = parser.parse(model);
    const cursor = tree.walk();
    const componentQuery = river.query(`(config_file (block) @component)`);
    const matches = componentQuery.matches(tree.rootNode);
    const components = matches.map((match) => {
      const node = match.captures[0].node;
      return { node, block: River.UnmarshalBlock(node) };
    });
    componentsRef.current = components;
    const imports = setComponents(components);

    const errs = findErrors(cursor);
    const infos = provideInfoMarkers(components, imports);
    const mmdl = editorRef.current?.getModel();
    if (mmdl) {
      monacoRef.current?.editor.setModelMarkers(mmdl, "ts", [
        ...errs,
        ...infos,
      ]);
    }
    const duration = (performance.now() - start).toFixed(1);
    setParsingTime(duration);
  }, [setComponents, model, setParsingTime]);

  useEffect(() => {
    (async () => {
      await Parser.init({
        locateFile(scriptName: string, scriptDirectory: string) {
          return scriptName;
        },
      });
      const parser = new Parser();
      const river = await Parser.Language.load("tree-sitter-river.wasm");
      parser.setLanguage(river);
      parserRef.current = { parser, river };
      parseComponents();
    })();
  }, [parseComponents]);

  const provideCodeLenses = useCallback(function(
    model: monaco.editor.ITextModel,
    token: monaco.CancellationToken,
  ) {
    if (!commandRef.current) return;
    const { addComponent, editComponent } = commandRef.current;
    const lastLine = model.getLineCount();
    const lenses: monaco.languages.CodeLens[] = [
      {
        range: {
          startLineNumber: lastLine,
          endLineNumber: lastLine,
          startColumn: 1,
          endColumn: 1,
        },
        command: {
          id: addComponent,
          title: "Add Component",
        },
      },
    ];
    if (!parserRef.current) {
      return {
        lenses,
        dispose: () => { },
      };
    }
    if (!componentsRef.current) return;
    lenses.push(
      ...componentsRef.current.map((c) => {
        return {
          range: {
            startLineNumber: c.node.startPosition.row + 1,
            startColumn: c.node.startPosition.column,
            endLineNumber: c.node.endPosition.row + 1,
            endColumn: c.node.endPosition.column,
          },
          command: {
            id: editComponent,
            title: "Edit Component",
            arguments: [River.UnmarshalBlock(c.node), c.node],
          },
        };
      }),
    );
    return {
      lenses,
      dispose: () => { },
    };
  }, []);

  const handleEditorDidMount = useCallback(
    (editor: monaco.editor.IStandaloneCodeEditor, monaco: Monaco) => {
      monaco.editor.defineTheme("thema-dark", {
        base: "vs-dark",
        inherit: true,
        rules: [],
        colors: {
          "editor.background": "#22252b",
        },
      });
      monaco.editor.defineTheme("thema-light", {
        base: "vs",
        inherit: true,
        rules: [],
        colors: {
          "editor.background": "#F4F5F5",
        },
      });
      monaco.editor.setTheme(editorTheme);

      var addComponentCommand = editor.addCommand(
        0,
        function() {
          setCurrentComponent(null);
          setDrawerOpen(true);
        },
        "",
      );
      var editComponentCommand = editor.addCommand(
        0,
        function(ctx, component: River.Block, node: Parser.SyntaxNode) {
          setCurrentComponent({
            component,
            node,
          });
          setDrawerOpen(true);
        },
        "",
      );

      commandRef.current = {
        addComponent: addComponentCommand!,
        editComponent: editComponentCommand!,
      };

      monaco.languages.registerCodeLensProvider("hcl", {
        provideCodeLenses,
        resolveCodeLens: function(model, codeLens, token) {
          return codeLens;
        },
      });
      editorRef.current = editor;
      monacoRef.current = monaco;
    },
    [editorTheme, provideCodeLenses],
  );

  useEffect(parseComponents, [model, setComponents, parseComponents]);

  const onChange = (text: string | undefined) => {
    setModel(text || "");
    localStorage.setItem("config.river", text || "");
  };

  const insertComponent = (component: River.Block) => {
    setCurrentComponent({
      component,
      node: null,
    });
  };
  const insertImport = (component: River.Block) => {
    const editor = editorRef.current!;
    editor.executeEdits("configuration-editor", [
      {
        range: {
          startLineNumber: 0,
          endLineNumber: 0,
          startColumn: 0,
          endColumn: 0,
        },
        text: component.marshal() + "\n\n",
      },
    ]);
  };

  const updateComponent = (component: River.Block) => {
    const editor = editorRef.current!;
    const model = editor.getModel()!;
    if (currentComponent === null) {
      return;
    }
    if (currentComponent.node !== null) {
      const node = currentComponent.node!;
      const edits = [
        {
          range: {
            startLineNumber: node.startPosition.row + 1,
            startColumn: node.startPosition.column,
            endLineNumber: node.endPosition.row + 1,
            endColumn: node.endPosition.column + 1,
          },
          text: component.marshal(),
        },
      ];
      const oldLabel = node.childForFieldName("label")?.namedChild(0)?.text;
      const oldRef = `${component.name}.${oldLabel}`;

      const existingRefs = model.findMatches(
        oldRef, // searchString
        true, // searchOnlyEditableRange
        false, // isRegex
        true, // matchCase
        null, // wordSeparators
        false, // captureMatches
      );
      for (const ref of existingRefs) {
        edits.push({
          range: ref.range,
          text: `${component.name}.${component.label}`,
        });
      }
      editor.executeEdits("configuration-editor", edits);
    } else {
      const lastLine = model.getLineCount();
      const column = model.getLineMaxColumn(lastLine);
      editor.executeEdits("configuration-editor", [
        {
          range: {
            startLineNumber: model.getLineCount(),
            endLineNumber: model.getLineCount(),
            startColumn: column,
            endColumn: column,
          },
          text: component.marshal() + "\n",
        },
      ]);
    }

    setDrawerOpen(false);
  };

  return (
    <>
      <Editor
        options={defaultOpts}
        theme={editorTheme}
        height="95%"
        value={model}
        defaultLanguage="hcl"
        onMount={handleEditorDidMount}
        onChange={onChange}
      />
      <div className={styles.statusbar}>
        <span></span>
        <span>Parsed in {parsingTime}ms</span>
      </div>
      {isDrawerOpen && (
        <Drawer
          onClose={() => setDrawerOpen(false)}
          title={
            currentComponent != null
              ? `Edit Component [${currentComponent.component.name}]`
              : "Add Component"
          }
          subtitle={
            currentComponent != null ? (
              <HorizontalGroup>
                {currentComponent?.node == null && (
                  <Button
                    aria-label="back"
                    icon="arrow-left"
                    fill="text"
                    variant="secondary"
                    onClick={() => setCurrentComponent(null)}
                  />
                )}
                <LinkButton
                  href={`https://grafana.com/docs/alloy/latest/reference/components/${currentComponent.component.name}/`}
                  icon="external-link-alt"
                  variant="secondary"
                  target="_blank"
                >
                  Component Documentation
                </LinkButton>
              </HorizontalGroup>
            ) : null
          }
        >
          {!currentComponent && (
            <ComponentList
              addComponent={insertComponent}
              addImport={insertImport}
            />
          )}
          {currentComponent && (
            <ComponentEditor
              component={currentComponent.component}
              updateComponent={updateComponent}
              discard={() => setDrawerOpen(false)}
            />
          )}
        </Drawer>
      )}
    </>
  );
};

const getStyles = (theme: GrafanaTheme2) => {
  return {
    statusbar: css`
      display: flex;
      justify-content: space-between;
      color: ${theme.colors.text.secondary};
      font-variant-numeric: tabular-nums;
    `,
  };
};
export default ConfigEditor;
