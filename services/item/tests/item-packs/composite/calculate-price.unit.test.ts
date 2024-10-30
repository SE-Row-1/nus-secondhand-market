import { calculatePrice } from "@/item-packs/composite";
import { expect, it } from "bun:test";

it("calculates price for leaf", () => {
  const price = calculatePrice({ price: 10 });

  expect(price).toEqual(10);
});

it("calculates price for simple composite", () => {
  const price = calculatePrice({
    discount: 0.2,
    children: [{ price: 5 }, { price: 15 }],
  });

  expect(price).toEqual(16);
});

it("calculates price for nested composite", () => {
  const price = calculatePrice({
    discount: 0.2,
    children: [
      { price: 5 },
      {
        discount: 0.5,
        children: [{ price: 10 }, { price: 20 }],
      },
    ],
  });

  expect(price).toEqual(16);
});
