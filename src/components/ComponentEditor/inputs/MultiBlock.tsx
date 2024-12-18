import { css } from "@emotion/css";
import { GrafanaTheme2 } from "@grafana/data";
import { Button, Card, FieldSet, IconButton } from "@grafana/ui";
import { useFieldArray } from "react-hook-form";
import { useStyles } from "../../../theme";

const MultiBlock = ({
  name,
  title,
  children,
  newBlock,
}: {
  name: string;
  title: string;
  children: (
    field: Record<string, any>,
    index: number,
  ) => React.ReactNode[] | React.ReactNode;
  newBlock?: any;
}) => {
  const { fields, append, remove } = useFieldArray({ name });
  const styles = useStyles(getStyles);
  newBlock = newBlock ?? {};
  return (
    <FieldSet label={title}>
      {fields.map((field, index) => (
        <Card key={field.id} className={styles.card}>
          {children(field, index)}
          <Card.SecondaryActions>
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
      ))}
      <Button onClick={() => append(newBlock)} icon="plus">
        Add
      </Button>
    </FieldSet>
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

export default MultiBlock;
