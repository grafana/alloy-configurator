import * as React from "react";
import { Dropdown, IconButton, IconName, Input, Menu } from "@grafana/ui";
import { Control, Controller, get } from "react-hook-form";

type Type = "literal" | "reference" | "env";

const outValue = (v: string, type: Type) => {
  switch (type) {
    case "literal":
      return v;
    case "reference":
      return { "-reference": v };
    case "env":
      return { "-function": { name: "env", params: [v] } };
  }
};

const InputTypes: Record<Type, { icon: IconName; name: string }> = {
  env: {
    icon: "x" as IconName,
    name: "Environment Variable",
  },
  literal: {
    icon: "pen" as IconName,
    name: "Literal",
  },
  reference: {
    icon: "link" as IconName,
    name: "Reference",
  },
};

const TypedInput = ({
  name,
  control,
  rules,
  placeholder,
  defaultValue,
  type,
  width,
}: {
  name: string;
  control: Control<any>;
  rules?: Object;
  placeholder?: string;
  defaultValue?: Record<string, any> | string;
  type?: "text" | "number";
  width?: number;
}) => {
  defaultValue = defaultValue ?? get(control.defaultValuesRef.current, name);
  const [inputType, setInputType] = React.useState<Type>("literal");
  const [inputValue, setInputValue] = React.useState<string>(() => {
    if (!defaultValue) return "";
    if (typeof defaultValue === "string") return defaultValue;
    if (defaultValue["-reference"]) {
      setInputType("reference");
      return defaultValue["-reference"];
    }
    if (defaultValue["-function"]) {
      setInputType("env");
      if (defaultValue["-function"].name === "env")
        return defaultValue["-function"]?.params[0];
    }
    return "";
  });

  const updateType = React.useCallback(
    (t: Type, onChange: (...event: any[]) => void) => {
      return () => {
        setInputType(t);
        onChange(outValue(inputValue, t));
      };
    },
    [inputValue],
  );
  const types = Object.keys(InputTypes);
  return (
    <Controller
      name={name}
      control={control}
      rules={rules || {}}
      render={({ field: { onChange } }) => (
        <Input
          placeholder={placeholder}
          width={width}
          prefix={
            <Dropdown
              overlay={
                <Menu>
                  {types.map((tn) => {
                    const t = InputTypes[tn as Type];
                    return (
                      <Menu.Item
                        key={tn}
                        icon={t.icon}
                        label={t.name}
                        onClick={updateType(tn as Type, onChange)}
                      />
                    );
                  })}
                </Menu>
              }
              placement="bottom-start"
            >
              <IconButton
                tooltip={InputTypes[inputType].name}
                variant="secondary"
                name={InputTypes[inputType].icon}
                onClick={(e) => e.preventDefault()}
              />
            </Dropdown>
          }
          value={inputValue}
          type={inputType !== "literal" ? "text" : (type ?? "text")}
          onChange={(v) => {
            setInputValue(v.currentTarget.value);
            onChange(outValue(v.currentTarget.value, inputType));
          }}
        />
      )}
    />
  );
};

export default TypedInput;
