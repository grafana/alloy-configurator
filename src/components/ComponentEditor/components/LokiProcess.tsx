import { css } from "@emotion/css";
import { GrafanaTheme2 } from "@grafana/data";
import {
  Alert,
  Button,
  Card,
  FieldArray,
  FieldSet,
  FormAPI,
  IconButton,
  InlineField,
  InlineSwitch,
  InputControl,
  MultiSelect,
  Select,
} from "@grafana/ui";
import { get } from "react-hook-form";
import { useStyles } from "../../../theme";
import GenericStringMap from "../inputs/GenericStringMap";
import ReferenceMultiSelect from "../inputs/ReferenceMultiSelect";
import TypedInput from "../inputs/TypedInput";

const stages = [
  {
    value: "stage.cri",
    label: "CRI",
    description: "Configures a pre-defined CRI-format pipeline.",
  },
  {
    value: "stage.docker",
    label: "Docker",
    description: "Configures a pre-defined Docker log format pipeline.",
  },
  {
    value: "stage.drop",
    label: "Drop",
    description: "Configures a drop processing stage.",
    editor: (parent: string, methods: FormAPI<Record<string, any>>) => {
      return (
        <>
          <InlineField
            label="Source"
            tooltip="Name from extracted data to parse. If empty or not defined, it uses the log message."
          >
            <TypedInput name={`${parent}.source`} control={methods.control} />
          </InlineField>
          <InlineField
            label="Expression"
            tooltip="	A valid RE2 regular expression."
          >
            <TypedInput
              name={`${parent}.expression`}
              control={methods.control}
            />
          </InlineField>
          <InlineField
            label="Value"
            tooltip="If both source and value are specified, the stage drops lines where value exactly matches the source content."
          >
            <TypedInput name={`${parent}.value`} control={methods.control} />
          </InlineField>
          <InlineField
            label="Older than"
            tooltip="If specified, the stage drops lines whose timestamp is older than the current time minus this duration."
          >
            <TypedInput
              name={`${parent}.older_than`}
              control={methods.control}
            />
          </InlineField>
          <InlineField
            label="Longer than"
            tooltip="If specified, the stage drops lines whose size exceeds the configured value."
          >
            <TypedInput
              name={`${parent}.longer_than`}
              control={methods.control}
            />
          </InlineField>
          <InlineField
            label="Drop counter reason"
            tooltip="	A custom reason to report for dropped lines."
          >
            <TypedInput
              name={`${parent}.drop_counter_reason`}
              control={methods.control}
              placeholder="drop_stage"
            />
          </InlineField>
        </>
      );
    },
  },
  {
    value: "stage.json",
    label: "JSON",
    description: "Configures a JSON processing stage.",
    editor: (parent: string, methods: FormAPI<Record<string, any>>) => {
      return (
        <>
          <GenericStringMap
            name={`${parent}.expressions`}
            control={methods.control}
            title="Expressions"
          />
          <InlineField
            label="Source"
            tooltip="Source of the data to parse as JSON."
          >
            <TypedInput name={`${parent}.source`} control={methods.control} />
          </InlineField>
          <InlineField
            label="Drop malformed"
            tooltip="Drop lines whose input cannot be parsed as valid JSON."
          >
            <InlineSwitch
              {...methods.register(`${parent}.drop_malformed` as const)}
              defaultChecked={get(
                methods.control.defaultValuesRef.current,
                `${parent}.drop_malformed` as const,
              )}
            />
          </InlineField>
        </>
      );
    },
    postTransform(s: Record<string, any>) {
      s.expressions = Object.assign(
        {},
        ...s.expressions.map((x: { key: string; value: string }) => ({
          [x.key]: x.value,
        })),
      );
      return s;
    },
    preTransform(s: Record<string, any>) {
      s.expressions = Object.keys(s.expressions).map((k) => ({
        key: k,
        value: s.expressions[k],
      }));
      return s;
    },
  },
  {
    value: "stage.label_drop",
    label: "Label drop",
    description: "Drop labels from an incoming message",
    editor: (parent: string, methods: FormAPI<Record<string, any>>) => {
      return (
        <>
          <InlineField label="Labels" tooltip="List of labels to drop">
            <InputControl
              render={({ field: { onChange, ref, ...field } }) => (
                <MultiSelect
                  {...field}
                  onChange={(v) => onChange(v.map((x) => x.value))}
                  options={[]}
                  allowCustomValue
                  placeholder="Add new value"
                  width={26}
                />
              )}
              control={methods.control}
              name={`${parent}.values`}
            />
          </InlineField>
        </>
      );
    },
  },
  {
    value: "stage.label_keep",
    label: "Label keep",
    description:
      "Filters the label set of an incoming log entry down to a subset.",
    editor: (parent: string, methods: FormAPI<Record<string, any>>) => {
      return (
        <>
          <InlineField label="Labels" tooltip="Labels to filter log entries">
            <InputControl
              render={({ field: { onChange, ref, ...field } }) => (
                <MultiSelect
                  {...field}
                  onChange={(v) => onChange(v.map((x) => x.value))}
                  options={[]}
                  allowCustomValue
                  placeholder="Add new value"
                  width={26}
                />
              )}
              control={methods.control}
              name={`${parent}.values`}
            />
          </InlineField>
        </>
      );
    },
  },
  {
    value: "stage.labels",
    label: "Labels",
    description:
      "Configures a labels processing stage that can read data from the extracted values map and set new labels on incoming log entries.",
    editor: (parent: string, methods: FormAPI<Record<string, any>>) => {
      return (
        <>
          <GenericStringMap
            name={`${parent}.values`}
            control={methods.control}
            title="Labels"
          />
        </>
      );
    },
    postTransform(s: Record<string, any>) {
      s.values = Object.assign(
        {},
        ...s.values.map((x: { key: string; value: string }) => ({
          [x.key]: x.value,
        })),
      );
      return s;
    },
    preTransform(s: Record<string, any>) {
      s.values = Object.keys(s.values).map((k) => ({
        key: k,
        value: s.values[k],
      }));
      return s;
    },
  },
  {
    value: "stage.limit",
    label: "Limit",
    description: "Configures a limit processing stage.",
    editor: (parent: string, methods: FormAPI<Record<string, any>>) => {
      return (
        <>
          <InlineField
            label="Rate"
            tooltip="The maximum rate of lines per second that the stage forwards."
          >
            <TypedInput
              name={`${parent}.rate`}
              control={methods.control}
              type="number"
            />
          </InlineField>
          <InlineField
            label="Burst"
            tooltip="The cap in the quantity of burst lines that the stage forwards."
          >
            <TypedInput
              name={`${parent}.burst`}
              control={methods.control}
              type="number"
            />
          </InlineField>
          <InlineField
            label="By label name"
            tooltip="The label to use when rate-limiting on a label name."
          >
            <TypedInput
              name={`${parent}.by_label_name`}
              control={methods.control}
            />
          </InlineField>
          <InlineField
            label="Drop"
            tooltip="Whether to discard or backpressure lines that exceed the rate limit."
          >
            <InlineSwitch
              {...methods.register(`${parent}.drop` as const)}
              defaultChecked={get(
                methods.control.defaultValuesRef.current,
                `${parent}.drop` as const,
              )}
            />
          </InlineField>
          <InlineField
            label="Max distinct labels"
            tooltip="The number of unique values to keep track of when rate-limiting by_label_name."
          >
            <TypedInput
              name={`${parent}.max_distinct_labels`}
              control={methods.control}
              type="number"
            />
          </InlineField>
        </>
      );
    },
  },
  {
    value: "stage.logfmt",
    label: "logfmt",
    description: "Configures a logfmt processing stage.",
    editor: (parent: string, methods: FormAPI<Record<string, any>>) => {
      return (
        <>
          <GenericStringMap
            name={`${parent}.mapping`}
            control={methods.control}
            title="Mapping"
          />
          <InlineField
            label="Source"
            tooltip="Source of the data to parse as logfmt. If empty, this stage will parse the log line"
          >
            <TypedInput name={`${parent}.source`} control={methods.control} />
          </InlineField>
        </>
      );
    },
    postTransform(s: Record<string, any>) {
      s.values = Object.assign(
        {},
        ...s.mapping.map((x: { key: string; value: string }) => ({
          [x.key]: x.value,
        })),
      );
      return s;
    },
    preTransform(s: Record<string, any>) {
      s.values = Object.keys(s.mapping).map((k) => ({
        key: k,
        value: s.mapping[k],
      }));
      return s;
    },
  },
  {
    value: "stage.match",
    label: "Match",
    description: "Configures a match processing stage.",
    editor: (parent: string, methods: FormAPI<Record<string, any>>) => {
      return (
        <>
          <InlineField
            label="Selector"
            tooltip="The LogQL stream selector and filter expressions to use."
            required
          >
            <TypedInput name={`${parent}.selector`} control={methods.control} />
          </InlineField>
          <InlineField
            label="Pipeline name"
            tooltip="A custom name to use for the nested pipeline."
          >
            <TypedInput
              name={`${parent}.pipeline_name`}
              control={methods.control}
            />
          </InlineField>
          <InlineField
            label="Action"
            tooltip="The action to take when the selector matches the log line. Supported values are 'keep' and 'drop'"
          >
            <TypedInput
              name={`${parent}.action`}
              control={methods.control}
              placeholder="keep"
            />
          </InlineField>
          <InlineField
            label="Drop counter reason"
            tooltip="A custom reason to report for dropped lines."
          >
            <TypedInput
              name={`${parent}.drop_counter_reason`}
              control={methods.control}
              placeholder="match_stage"
            />
          </InlineField>
        </>
      );
    },
  },
  {
    value: "stage.metrics",
    label: "Metrics",
    description: "Configures a metrics stage.",
    editor: (_parent: string, _methods: FormAPI<Record<string, any>>) => {
      return (
        <Alert severity="error" title="Unsupported component">
          <p>
            The metrics processing stage is currently not supported for
            graphical editing. If this feature is important to you, please open
            an issue in the
            <a
              href="https://github.com/grafana/alloy-configurator"
              target="_blank"
              rel="noreferrer"
            >
              GitHub Repository
            </a>
          </p>
        </Alert>
      );
    },
  },
  {
    value: "stage.multiline",
    label: "Multiline",
    description: "Configures a multiline processing stage.",
    editor: (parent: string, methods: FormAPI<Record<string, any>>) => {
      return (
        <>
          <InlineField
            label="Firstline"
            tooltip="Name from extracted data to use for the log entry."
            required
          >
            <TypedInput
              name={`${parent}.firstline`}
              control={methods.control}
            />
          </InlineField>
          <InlineField
            label="Max. wait time"
            tooltip="The maximum time to wait for a multiline block."
          >
            <TypedInput
              name={`${parent}.max_wait_time`}
              control={methods.control}
            />
          </InlineField>
          <InlineField
            label="Max. lines"
            tooltip="The maximum number of lines a block can have."
          >
            <TypedInput
              name={`${parent}.max_lines`}
              control={methods.control}
              placeholder="128"
              type="number"
            />
          </InlineField>
        </>
      );
    },
  },
  {
    value: "stage.output",
    label: "Output",
    description: "Configures an output processing stage.",
    editor: (parent: string, methods: FormAPI<Record<string, any>>) => {
      return (
        <>
          <InlineField
            label="Source"
            tooltip="Name from extracted data to use for the log entry."
            required
          >
            <TypedInput name={`${parent}.source`} control={methods.control} />
          </InlineField>
        </>
      );
    },
  },
  {
    value: "stage.pack",
    label: "Pack",
    description: "Configures a pack processing stage.",
    editor: (parent: string, methods: FormAPI<Record<string, any>>) => {
      return (
        <>
          <InlineField
            label="Labels"
            tooltip="The values from the extracted data and labels to pack with the log entry."
          >
            <InputControl
              render={({ field: { onChange, ref, ...field } }) => (
                <MultiSelect
                  {...field}
                  onChange={(v) => onChange(v.map((x) => x.value))}
                  options={[]}
                  allowCustomValue
                  placeholder="Add new value"
                  width={26}
                />
              )}
              control={methods.control}
              name={`${parent}.labels`}
            />
          </InlineField>
          <InlineField
            label="Ingest timestamp"
            tooltip="Whether to replace the log entry timestamp with the time the pack stage runs."
          >
            <InlineSwitch
              {...methods.register(`${parent}.ingest_timestamp` as const)}
              defaultChecked={get(
                methods.control.defaultValuesRef.current,
                `${parent}.ingest_timestamp` as const,
              )}
            />
          </InlineField>
        </>
      );
    },
  },
  {
    value: "stage.regex",
    label: "RegEx",
    description: "Configures a regex processing stage.",
    editor: (parent: string, methods: FormAPI<Record<string, any>>) => {
      return (
        <>
          <InlineField
            label="Expression"
            tooltip="A valid RE2 regular expression. Each capture group must be named."
          >
            <TypedInput
              name={`${parent}.expression`}
              control={methods.control}
            />
          </InlineField>
          <InlineField
            label="Source"
            tooltip="Name from extracted data to parse. If empty, uses the log message."
          >
            <TypedInput name={`${parent}.source`} control={methods.control} />
          </InlineField>
        </>
      );
    },
  },
  {
    value: "stage.replace",
    label: "Replace",
    description: "Configures a replace processing stage.",
    editor: (parent: string, methods: FormAPI<Record<string, any>>) => {
      return (
        <>
          <InlineField
            label="Expression"
            tooltip="Name from extracted data to use for the log entry."
          >
            <TypedInput
              name={`${parent}.expression`}
              control={methods.control}
            />
          </InlineField>
          <InlineField
            label="Source"
            tooltip="Source of the data to parse. If empty, it uses the log message."
          >
            <TypedInput name={`${parent}.source`} control={methods.control} />
          </InlineField>
          <InlineField
            label="Replace"
            tooltip="Value replaced by the capture group."
          >
            <TypedInput name={`${parent}.replace`} control={methods.control} />
          </InlineField>
        </>
      );
    },
  },
  {
    value: "stage.static_labels",
    label: "Static Labels",
    description: "Configures a static_labels processing stage.",
    editor: (parent: string, methods: FormAPI<Record<string, any>>) => {
      return (
        <>
          <GenericStringMap
            name={`${parent}.values`}
            control={methods.control}
            title="Labels"
          />
        </>
      );
    },
    postTransform(s: Record<string, any>) {
      s.values = Object.assign(
        {},
        ...s.values.map((x: { key: string; value: string }) => ({
          [x.key]: x.value,
        })),
      );
      return s;
    },
    preTransform(s: Record<string, any>) {
      s.values = Object.keys(s.values).map((k) => ({
        key: k,
        value: s.values[k],
      }));
      return s;
    },
  },
  {
    value: "stage.template",
    label: "Template",
    description: "Configures a template processing stage.",
    editor: (parent: string, methods: FormAPI<Record<string, any>>) => {
      return (
        <>
          <InlineField
            label="Source"
            tooltip="Name from extracted data to parse. If the key doesn’t exist, a new entry is created."
          >
            <TypedInput name={`${parent}.source`} control={methods.control} />
          </InlineField>
          <InlineField label="Template" tooltip="Go template string to use.">
            <TypedInput name={`${parent}.template`} control={methods.control} />
          </InlineField>
        </>
      );
    },
  },
  {
    value: "stage.tenant",
    label: "Tenant",
    description: "Configures a tenant processing stage.",
    editor: (parent: string, methods: FormAPI<Record<string, any>>) => {
      return (
        <>
          <InlineField label="Label" tooltip="The label to set as tenant ID.">
            <TypedInput name={`${parent}.label`} control={methods.control} />
          </InlineField>
          <InlineField
            label="Source"
            tooltip="The name from the extracted value to use as tenant ID."
          >
            <TypedInput name={`${parent}.source`} control={methods.control} />
          </InlineField>
          <InlineField
            label="Value"
            tooltip="The value to set as the tenant ID."
          >
            <TypedInput name={`${parent}.value`} control={methods.control} />
          </InlineField>
        </>
      );
    },
  },
  {
    value: "stage.timestamp",
    label: "Timestamp",
    description: "Configures a timestamp processing stage.",
    editor: (parent: string, methods: FormAPI<Record<string, any>>) => {
      return (
        <>
          <InlineField
            label="Source"
            tooltip="Name from extracted values map to use for the timestamp."
            required
          >
            <TypedInput name={`${parent}.source`} control={methods.control} />
          </InlineField>
          <InlineField
            label="Format"
            tooltip="Determines how to parse the source string."
            required
          >
            <TypedInput name={`${parent}.format`} control={methods.control} />
          </InlineField>

          <InlineField
            label="Fallback formats"
            tooltip="Fallback formats to try if the format field fails."
          >
            <InputControl
              render={({ field: { onChange, ref, ...field } }) => (
                <MultiSelect
                  {...field}
                  onChange={(v) => onChange(v.map((x) => x.value))}
                  options={[]}
                  allowCustomValue
                  placeholder="Add new value"
                  width={26}
                />
              )}
              control={methods.control}
              name={`${parent}.fallback_formats`}
            />
          </InlineField>
          <InlineField
            label="Location"
            tooltip="IANA Timezone Database location to use when parsing."
          >
            <TypedInput name={`${parent}.location`} control={methods.control} />
          </InlineField>
          <InlineField
            label="Action on failure"
            tooltip="What to do when the timestamp can’t be extracted or parsed."
          >
            <TypedInput
              name={`${parent}.action_on_failure`}
              control={methods.control}
              placeholder="fudge"
            />
          </InlineField>
        </>
      );
    },
  },
  {
    value: "stage.geoip",
    label: "GeoIP",
    description: "Configures a geoip processing stage.",
    editor: (parent: string, methods: FormAPI<Record<string, any>>) => {
      return (
        <>
          <InlineField
            label="Database path"
            tooltip="Path to the Maxmind DB file."
            required
          >
            <TypedInput name={`${parent}.db`} control={methods.control} />
          </InlineField>
          <InlineField
            label="Source"
            tooltip="IP from extracted data to parse."
          >
            <TypedInput name={`${parent}.source`} control={methods.control} />
          </InlineField>
          <InlineField
            label="Database type"
            tooltip="Maxmind DB type. Allowed values are “city”, “asn”."
          >
            <TypedInput name={`${parent}.db_type`} control={methods.control} />
          </InlineField>
          <GenericStringMap
            name={`${parent}.custom_lookups`}
            control={methods.control}
            title="Custom lookups"
          />
        </>
      );
    },
    postTransform(s: Record<string, any>) {
      s.custom_lookups = Object.assign(
        {},
        ...s.custom_lookups.map((x: { key: string; value: string }) => ({
          [x.key]: x.value,
        })),
      );
      return s;
    },
    preTransform(s: Record<string, any>) {
      s.custom_lookups = Object.keys(s.values).map((k) => ({
        key: k,
        value: s.custom_lookups[k],
      }));
      return s;
    },
  },
];
const stagesDict = Object.assign({}, ...stages.map((x) => ({ [x.value]: x })));

const Component = ({ methods }: { methods: FormAPI<Record<string, any>> }) => {
  const styles = useStyles(getStyles);
  return (
    <>
      <InlineField
        label="Forward to"
        tooltip="Where the logs should be forwarded to, after processing takes place."
        labelWidth={22}
        error="You must specify a list of destinations"
      >
        <ReferenceMultiSelect
          name="forward_to"
          exportName="LokiReceiver"
          control={methods.control}
        />
      </InlineField>
      <FieldSet label="Stages">
        <FieldArray control={methods.control} name="stages">
          {({ fields, append, remove, move, swap }) => (
            <>
              {fields.map((field, index) => {
                const stageType = methods.watch(
                  `stages[${index}].comp-name` as const,
                );
                return (
                  <Card key={field.id} className={styles.card}>
                    <Card.Heading>
                      <InputControl
                        render={({ field: { ref, ...field } }) => (
                          <Select {...field} options={stages} />
                        )}
                        control={methods.control}
                        name={`stages[${index}].comp-name` as const}
                      />
                    </Card.Heading>
                    <Card.Description>
                      {stageType && stageType.description}
                    </Card.Description>
                    <Card.Actions>
                      {stageType?.editor &&
                        stageType.editor(`stages[${index}]` as const, methods)}
                    </Card.Actions>
                    <Card.SecondaryActions>
                      {index !== 0 && (
                        <IconButton
                          name="arrow-up"
                          tooltip="Move this stage up"
                          onClick={(e) => {
                            move(index, index - 1);
                            e.preventDefault();
                          }}
                        />
                      )}
                      {index < fields.length - 1 && (
                        <IconButton
                          name="arrow-down"
                          tooltip="Move this stage down"
                          onClick={(e) => {
                            move(index, index + 1);
                            e.preventDefault();
                          }}
                        />
                      )}
                      <IconButton
                        key="delete"
                        name="trash-alt"
                        tooltip="Delete this filter"
                        onClick={(e) => {
                          remove(index);
                          e.preventDefault();
                        }}
                      />
                    </Card.SecondaryActions>
                  </Card>
                );
              })}
              <Button onClick={() => append({})} icon="plus">
                Add
              </Button>
            </>
          )}
        </FieldArray>
      </FieldSet>
    </>
  );
};

const getStyles = (theme: GrafanaTheme2) => {
  return {
    card: css`
      background: none !important;
      border: 1px solid ${theme.colors.border.weak};
    `,
  };
};

const LokiProcess = {
  preTransform(data: Record<string, any>): Record<string, any> {
    data.stages = data.stages
      .map((x: any) => ({
        ...x,
        "comp-name": stagesDict[x["comp-name"]],
      }))
      .map((s: any) => {
        if (stagesDict[s["comp-name"].value].preTransform)
          return stagesDict[s["comp-name"].value].preTransform(s);
        return s;
      });
    return data;
  },
  postTransform(data: Record<string, any>): Record<string, any> {
    data.stages = data.stages
      .map((s: Record<string, any>) => ({
        ...s,
        "comp-name": s["comp-name"].value,
      }))
      .map((s: Record<string, any>) => {
        if (stagesDict[s["comp-name"]].postTransform)
          return stagesDict[s["comp-name"]].postTransform(s);
        return s;
      });
    return data;
  },
  Component,
};

export default LokiProcess;
