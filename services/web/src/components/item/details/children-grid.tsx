import type { Item } from "@/types";
import { ItemCard } from "../card";

type Props = {
  items: Item[];
};

export function ChildrenGrid({ items }: Props) {
  return (
    <ul className="grid min-[480px]:grid-cols-2 gap-x-4 gap-y-6">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </ul>
  );
}
