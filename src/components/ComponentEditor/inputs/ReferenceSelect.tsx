import { SelectableValue } from "@grafana/data";
import { Select, InputControl } from "@grafana/ui";
import { get } from "react-hook-form";
import { useState } from "react";

import { useComponentContext } from "../../../state";
import { ReferenceSelectProps, toOptions } from "./ReferenceSelectBase";

const ReferenceSelect = ({
  control,
  name,
  exportName,
  width,
  defaultValue,
  rules,
}: ReferenceSelectProps<{ "-reference": string }>) => {
  const { components, imports } = useComponentContext();
  defaultValue = defaultValue ?? get(control.defaultValuesRef.current, name);
  const [value, setValue] = useState<SelectableValue<object>>(() => {
    if (!defaultValue) return null;
    return { label: defaultValue["-reference"], value: defaultValue };
  });
  const targetComponents = toOptions(
    components.map((x) => x.block),
    imports,
    exportName,
  );
  return (
    <InputControl
      render={({ field: { onChange, ref, ...field } }) => (
        <Select
          {...field}
          options={targetComponents}
          onChange={(v) => {
            onChange(v.value);
            setValue(v);
          }}
          value={value}
          width={width}
        />
      )}
      control={control}
      name={name}
      rules={rules || {}}
    />
  );
};

export default ReferenceSelect;
