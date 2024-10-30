export function calculatePrice(object: LeafObject | CompositeObject) {
  return mapObjectToClass(object).getPrice();
}

type LeafObject = {
  price: number;
};

type CompositeObject = {
  price?: number;
  discount: number;
  children: (LeafObject | CompositeObject)[];
};

type Composable = {
  getPrice: () => number;
};

class Leaf implements Composable {
  private price: number;

  public constructor(leaf: LeafObject) {
    this.price = leaf.price;
  }

  public getPrice() {
    return this.price;
  }
}

class Composite implements Composable {
  private price: number | undefined;
  private discount: number;
  private children: Composable[];

  public constructor(composite: CompositeObject) {
    this.price = composite.price;
    this.discount = composite.discount;
    this.children = composite.children.map(mapObjectToClass);
  }

  public getPrice() {
    if (this.price) {
      return this.price;
    }

    return (
      (1 - this.discount) *
      this.children.reduce((acc, child) => acc + child.getPrice(), 0)
    );
  }
}

/**
 * Other part of the codebase are written in FP.
 * But for Composite pattern, we have to introduce some OOP.
 * This is ugly. I know.
 */
function mapObjectToClass(object: LeafObject | CompositeObject): Composable {
  if ("children" in object) {
    return new Composite(object);
  }
  return new Leaf(object);
}
