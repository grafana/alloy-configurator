import Parser from "web-tree-sitter";
import { BlockType, ArgumentType } from "./components";

export function valuesToMap(
  v: Array<{ key: string; value: string }>,
): Record<string, string> {
  return v.reduce((acc, a) => ({ ...acc, [a.key]: a.value }), {});
}

export function mapToValues(
  v: Record<string, string>,
): Array<{ key: string; value: string }> {
  return Object.entries(v).map(([k, v]) => ({ key: k, value: v }));
}

export function encodeValue(v: any): string {
  switch (typeof v) {
    case "string":
    case "boolean":
    case "number":
      return JSON.stringify(v);
    case "object":
      if (Array.isArray(v)) {
        let out = "[\n";
        v.forEach((e) => {
          out += "  " + encodeValue(e).replaceAll("\n", "\n  ");
          out += ",\n";
        });
        return out + "]";
      }
      if (v["-reference"]) {
        return v["-reference"];
      }
      if (v["-function"]) {
        const f = v["-function"];
        return `${f.name}(${f.params?.map((p: any) => encodeValue(p))})`;
      }
      let out = "{\n";
      for (const k in v) {
        out += `  "${k}" = ${encodeValue(v[k])},\n`;
      }
      return out + "}";
    default:
      return `${v}`;
  }
}

export class Block {
  name: string;
  label: string | null;
  attributes: Argument[];
  constructor(
    name: string,
    label: string | null = null,
    attributes: Argument[] = [],
  ) {
    this.name = name;
    this.label = label;
    this.attributes = attributes;
  }
  marshal(): string {
    let out = `${this.name} `;
    if (this.label) {
      out += `"${this.label}" `;
    }
    out += "{\n";
    this.attributes.forEach((a) => {
      out += "  " + a.marshal().replaceAll("\n", "\n  ") + "\n";
    });
    out += "}";
    return out;
  }
  formValues(spec?: BlockType): Record<string, any> {
    let values: Record<string, any> = {};
    for (const argName of spec ? Object.keys(spec.args) : []) {
      const def = spec!.args[argName].default();
      if (def) values[argName] = def;
    }
    this.attributes.forEach((a) => {
      if (a instanceof Attribute) {
        values[a.name] = a.value;
      } else {
        const nestedSpec = spec?.args[a.name];
        const fv = a.formValues(
          nestedSpec instanceof BlockType ? nestedSpec : undefined,
        );
        if (nestedSpec?.orderedIn) {
          values[nestedSpec.orderedIn].push({ ...fv, "comp-name": a.name });
          return;
        }
        if (spec?.args[a.name]?.multiple()) {
          values[a.name] = values[a.name] ? [...values[a.name], fv] : [fv];
        } else {
          values[a.name] = fv;
        }
      }
    });
    return values;
  }
}

export class Attribute {
  name: string;
  value: any;
  constructor(name: string, value: any) {
    this.name = name;
    this.value = value;
  }
  marshal(): string {
    return `${this.name} = ${encodeValue(this.value)}`;
  }
  formValues(): Record<string, any> {
    let v: Record<string, any> = {};
    v[this.name] = this.value;
    return v;
  }
}

export interface Argument {
  name: string;
  marshal(): string;
  formValues(spec?: BlockType): Record<string, any>;
}

export function UnmarshalArray(n: Parser.SyntaxNode): any[] {
  let array = [];
  for (const entryNode of n.namedChildren) {
    array.push(UnmarshalValue(entryNode));
  }
  return array;
}

export function UnmarshalValue(node: Parser.SyntaxNode): any {
  let out: any;
  switch (node.type) {
    case "literal_value":
      out = JSON.parse(node.text);
      break;
    case "identifier":
      out = { "-reference": node.text };
      break;
    case "array":
      out = UnmarshalArray(node);
      break;
    case "object":
      out = {};
      for (const n of node.namedChildren) {
        const key = n.namedChild(0)!;
        const value = n.namedChild(1)!;
        if (key.type === "string_lit")
          out[JSON.parse(key.text)] = UnmarshalValue(value);
        else out[key.text] = UnmarshalValue(value);
      }
      break;
    case "function_call":
      out = {
        "-function": {
          name: node.childForFieldName("function")?.text,
        },
      };
      if (node.childForFieldName("params")) {
        out["-function"].params = UnmarshalArray(
          node.childForFieldName("params")!,
        );
      }
      break;
    default:
      out = {};
  }
  return out;
}

export function UnmarshalBlock(n: Parser.SyntaxNode): Block {
  const name = n.childForFieldName("name")!.text;
  const label = n.childForFieldName("label")?.namedChild(0)?.text;
  const argNodes = n.childForFieldName("body")?.namedChildren;
  const args: Argument[] = [];
  if (argNodes) {
    for (const arg of argNodes) {
      switch (arg.type) {
        case "attribute":
          const key = arg.childForFieldName("key")!.text;
          args.push(
            new Attribute(key, UnmarshalValue(arg.childForFieldName("value")!)),
          );
          break;
        case "block":
          args.push(UnmarshalBlock(arg));
          break;
      }
    }
  }
  return new Block(name, label, args);
}

export function toArgument(
  k: string,
  v: any,
  spec?: ArgumentType,
): Argument | null {
  if (k.indexOf("-") !== -1) {
    return null;
  }
  switch (typeof v) {
    case "undefined":
      return null;
    case "string":
    case "boolean":
    case "number":
      if (v === "" || v === null || Number.isNaN(v)) return null;
      if (v === spec?.default()) return null;
      return new Attribute(k, v);
    default:
      if (Array.isArray(v)) {
        return JSON.stringify(v) === JSON.stringify(spec?.default())
          ? null
          : new Attribute(k, v);
      }
      if (v["-reference"] || v["-function"]) {
        return new Attribute(k, v);
      }
      if (
        Object.keys(spec?.default as object).length === 0 &&
        Object.keys(v).length === 0
      ) {
        return null;
      }
      if (spec?.type === "attribute") {
        return new Attribute(k, v);
      }
      return toBlock(k, v, undefined, spec as BlockType);
  }
}

export function toBlock(
  k: string,
  v: any,
  label?: string,
  spec?: BlockType,
): Block | null {
  // flatmap instead of filter to avoid introducing the null type
  const args = Object.keys(v).flatMap((x) => {
    if (spec?.args[x]?.multiple()) {
      return (v[x] as Array<any>).flatMap((blockinstance) => {
        const b = toBlock(
          x,
          blockinstance,
          undefined,
          spec?.args[x] as BlockType,
        );
        if (b == null) return [];
        return [b];
      });
    } else if (spec?.args[x]?.ordered()) {
      return (v[x] as Array<any>).flatMap((blockinstance) => {
        const b = toBlock(
          blockinstance["comp-name"],
          blockinstance,
          undefined,
          spec?.args[blockinstance["comp-name"]] as BlockType,
        );
        if (b == null) return [];
        return [b];
      });
    } else {
      const arg = toArgument(x, v[x], spec?.args[x]);
      if (arg == null) {
        return [];
      }
      return [arg];
    }
  });
  if (label) return new Block(k, label, args);
  if (args.length === 0 && !(spec as BlockType)?.allowEmpty) return null;
  return new Block(k, label, args);
}

function extractRefs(...v: any[]): string[] {
  const out: string[] = [];
  for (const e of v) {
    if (typeof e === "object") {
      if (e["-reference"]) out.push(e["-reference"]);
      else out.push(...extractRefs(...Object.values(e)));
    }
  }
  return out;
}

export function collectReferences(component: Block): string[] {
  const out: string[] = [];
  for (const attr of component.attributes) {
    if (attr instanceof Attribute) {
      if (typeof attr.value === "object") {
        if (Array.isArray(attr.value)) out.push(...extractRefs(...attr.value));
        else out.push(...extractRefs(attr.value));
      }
    } else {
      out.push(...collectReferences(attr as Block));
    }
  }
  return out;
}
