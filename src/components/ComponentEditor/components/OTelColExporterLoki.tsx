import { InlineField, VerticalGroup } from "@grafana/ui";
import { useFormContext } from "react-hook-form";
import ReferenceMultiSelect from "../inputs/ReferenceMultiSelect";

const Component = () => {
  const commonOptions = {
    labelWidth: 25,
  };
  const { control } = useFormContext();
  return (
    <>
      <VerticalGroup>
        <InlineField label="Forward to" {...commonOptions}>
          <ReferenceMultiSelect
            control={control}
            name="forward_to"
            exportName="LokiReceiver"
          />
        </InlineField>
      </VerticalGroup>
    </>
  );
};

const OTelColExporterLoki = {
  preTransform(data: Record<string, any>): Record<string, any> {
    return data;
  },
  postTransform(data: Record<string, any>): Record<string, any> {
    return data;
  },
  Component,
};

export default OTelColExporterLoki;
