import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectItem,
  MultiSelectList,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/components/ui/multi-select";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { DetailedAccount, Item } from "@/types";
import { clientRequester } from "@/utils/requester/client";
import { useQuery } from "@tanstack/react-query";

type Props = {
  me: DetailedAccount;
  onValueChange: (value: string[]) => void;
};

export function BelongingsSelect({ me, onValueChange }: Props) {
  const { data: belongings, error } = useQuery({
    queryKey: ["items", "all-belongings"],
    queryFn: async () => {
      if (!me) {
        return [];
      }

      const { items } = await clientRequester.get<{ items: Item[] }>(
        `/items?seller_id=${me.id}&limit=100`,
      );

      return items;
    },
  });

  if (error) {
    return (
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder={error.message} />
        </SelectTrigger>
      </Select>
    );
  }

  return (
    <MultiSelect onValueChange={onValueChange}>
      <MultiSelectTrigger>
        <MultiSelectValue placeholder="Select at least 2 items" />
      </MultiSelectTrigger>
      <MultiSelectContent>
        <MultiSelectList>
          {belongings?.map((item) => (
            <MultiSelectItem key={item.id} value={item.id}>
              {item.name}
            </MultiSelectItem>
          ))}
        </MultiSelectList>
      </MultiSelectContent>
    </MultiSelect>
  );
}
