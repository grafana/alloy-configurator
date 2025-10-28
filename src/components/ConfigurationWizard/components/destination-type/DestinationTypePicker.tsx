import { Stack } from "@grafana/ui";
import { DestinationFormType } from "../../types/destination";
import { DestinationType } from "./DestinationType";
interface DestinationTypePickerProps {
  onChange: (value: DestinationFormType) => void;
  selected: DestinationFormType;
}

const DestinationTypePicker = ({
  onChange,
  selected,
}: DestinationTypePickerProps) => {
  return (
    <>
      <Stack direction="row" gap={2}>
        <DestinationType
          name="Cloud"
          value="cloud"
          icon="cloud"
          description="Send data to Grafana Cloud"
          onClick={onChange}
          selected={selected === "cloud"}
        />
        <DestinationType
          name="Local"
          value="local"
          icon="database"
          description="Send data to a local observability system"
          onClick={onChange}
          selected={selected === "local"}
        />
      </Stack>
    </>
  );
};
export default DestinationTypePicker;
