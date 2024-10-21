import type { Item } from "@/types";
import { ItemCard } from "./card";

type Props = {
  items: Item[];
};

export function ItemGrid({ items }: Props) {
  return (
    <ul className="grid min-[540px]:grid-cols-2 min-[720px]:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-6">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </ul>
  );
}
