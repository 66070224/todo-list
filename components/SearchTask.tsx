import { Dispatch, SetStateAction } from "react";
import { Input } from "./ui/input";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxValue,
  useComboboxAnchor,
} from "./ui/combobox";
import * as React from "react";

interface Props {
  title: string;
  setTitle: Dispatch<SetStateAction<string>>;
}

const statuses = [
  { value: "PENDING", label: "Pending" },
  { value: "PROGRESS", label: "In Process" },
  { value: "COMPLETED", label: "Completed" },
  { value: "BREAK", label: "Break" },
] as const;

export default function SearchTaskSection({ title, setTitle }: Props) {
  const statusesAnchor = useComboboxAnchor();
  return (
    <div>
      <Input placeholder="title" />
      <Combobox
        multiple
        autoHighlight
        items={statuses}
        defaultValue={[statuses[0]]}
      >
        <ComboboxChips ref={statusesAnchor}>
          <ComboboxValue>
            {(values) => (
              <>
                {values.map((value: (typeof statuses)[number]) => (
                  <ComboboxChip key={value.value}>{value.label}</ComboboxChip>
                ))}
              </>
            )}
          </ComboboxValue>
          <ComboboxChipsInput placeholder="Add status..." />
        </ComboboxChips>
        <ComboboxContent anchor={statusesAnchor}>
          <ComboboxList>
            {statuses.map((status) => (
              <ComboboxItem key={status.value} value={status}>
                {status.label}
              </ComboboxItem>
            ))}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}
