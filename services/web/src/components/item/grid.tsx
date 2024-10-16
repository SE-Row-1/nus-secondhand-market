import type { Item } from "@/types";
import { ItemCard } from "./card";

type Props = {
  items: Item[];
};

export function ItemGrid({ items }: Props) {
  return (
    <ul className="grid min-[480px]:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-x-4 gap-y-6">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </ul>
  );
}
