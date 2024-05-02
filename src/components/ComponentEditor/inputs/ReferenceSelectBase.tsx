import { SelectableValue } from "@grafana/data";
import { Control } from "react-hook-form";
import { Block } from "../../../lib/river";

import {
  ComponentType,
  ExportType,
  KnownComponents,
} from "../../../lib/components";

export function toOptions(
  components: Block[],
  imports: Record<string, ComponentType>,
  exportName: ExportType,
): SelectableValue<object>[] {
  const options: SelectableValue<object>[] = [];
  for (const component of components) {
    const spec = KnownComponents[component.name]
      ? KnownComponents[component.name]
      : imports[component.name];
    if (!spec) continue;
    for (const en of Object.keys(spec.exports)) {
      if (spec.exports[en] === exportName) {
        if (component.label) {
          options.push({
            label: `${component.label} [${component.name}]`,
            value: {
              "-reference": `${component.name}.${component.label}.${en}`,
            },
          });
        } else {
          options.push({
            label: `${component.name}`,
            value: {
              "-reference": `${component.name}.${en}`,
            },
          });
        }
      }
    }
  }
  return options;
}

export type ReferenceSelectProps<T> = {
  control: Control<Record<string, any>>;
  name: string;
  exportName: ExportType;
  width?: number;
  defaultValue?: T;
  rules?: object;
};
