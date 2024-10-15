import { ItemType, type Item } from "@/types";
import { ItemPackCard } from "./item-pack-card";
import { SingleItemCard } from "./single-item-card";

type Props = {
  item: Item;
};

export function ItemCard({ item }: Props) {
  switch (item.type) {
    case ItemType.SINGLE:
      return <SingleItemCard item={item} />;
    case ItemType.PACK:
      return <ItemPackCard item={item} />;
    default:
      return null;
  }
}
