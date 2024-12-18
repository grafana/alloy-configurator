import { InlineField, Input } from "@grafana/ui";
import { useFormContext } from "react-hook-form";

const PrometheusExporterMysql = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <>
      <InlineField
        label="Data Source Name"
        tooltip="Data Source Name for the MySQL server to connect to."
        error="The data source name is required"
        invalid={!!errors["data_source_name"]}
        labelWidth={20}
      >
        <Input
          {...register("data_source_name", { required: true })}
          placeholder="root@(server-a:3306)/"
        />
      </InlineField>
    </>
  );
};

export default PrometheusExporterMysql;
