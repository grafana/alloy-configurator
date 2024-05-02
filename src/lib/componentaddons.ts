import Parser from "web-tree-sitter";
import * as monaco from "monaco-editor";
import { Block } from "./river";
import { KnownComponents, ComponentType } from "./components";

export const markersFor = (
  node: Parser.SyntaxNode,
  block: Block,
  imports: Record<string, ComponentType>,
): monaco.editor.IMarkerData[] => {
  const c = KnownComponents[block.name]
    ? KnownComponents[block.name]
    : imports[block.name];
  if (!c) return [];
  if (c.markersFor === undefined) return [];
  return c.markersFor(node, block);
};
