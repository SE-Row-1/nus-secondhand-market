import { type Item, type ItemPack, type SingleItem } from "@/types";

/**
 * Other part of the codebase are written in FP.
 * But for Composite pattern, we have to introduce some OOP.
 * This is ugly. I know.
 *
 * @note I hate OOP.
 */
function mapObjectToClass(item: Item): Composable {
  if (item.type === "single") {
    return new CompositeSingleItem(item);
  }
  return new CompositeItemPack(item);
}

interface Composable {
  price: number;
}

class CompositeSingleItem implements Composable {
  constructor(private readonly item: SingleItem) {}

  public get price() {
    return this.item.price;
  }
}

export class CompositeItemPack implements Composable {
  private readonly composableChildren: Composable[];

  constructor(private readonly item: Omit<ItemPack, "price">) {
    this.composableChildren = item.children.map(mapObjectToClass);
  }

  public get price() {
    return (
      (1 - this.item.discount) *
      this.composableChildren.reduce((acc, item) => acc + item.price, 0)
    );
  }
}
