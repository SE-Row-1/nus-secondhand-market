import { StatefulItem } from "@/items/states";
import { ItemStatus, ItemType, type Item } from "@/types";
import { describe, expect, it } from "bun:test";
import { HTTPException } from "hono/http-exception";
import { me, someone } from "../test-utils/mock-data";

const item: Item = {
  id: "0",
  type: ItemType.Single,
  name: "test",
  description: "test",
  price: 100,
  photoUrls: [],
  status: ItemStatus.ForSale,
  seller: me.simplifiedAccount,
  createdAt: new Date(),
  deletedAt: null,
};

describe("FOR SALE -> DEALT", () => {
  it("succeeds if the actor is the seller", () => {
    const statefulItem = new StatefulItem(item);
    statefulItem.transitionTo(ItemStatus.Dealt, me.simplifiedAccount);
    expect(statefulItem.getRepresentation().status).toEqual(ItemStatus.Dealt);
  });

  it("fails if the actor is not the seller", () => {
    const statefulItem = new StatefulItem(item);
    expect(() =>
      statefulItem.transitionTo(ItemStatus.Dealt, someone.simplifiedAccount),
    ).toThrow(HTTPException);
    expect(statefulItem.getRepresentation().status).toEqual(ItemStatus.ForSale);
  });
});

describe("FOR SALE -> SOLD", () => {
  it("always fails", () => {
    const statefulItem = new StatefulItem(item);
    expect(() =>
      statefulItem.transitionTo(ItemStatus.Sold, me.simplifiedAccount),
    ).toThrow(HTTPException);
    expect(() =>
      statefulItem.transitionTo(ItemStatus.Sold, someone.simplifiedAccount),
    ).toThrow(HTTPException);
    expect(statefulItem.getRepresentation().status).toEqual(ItemStatus.ForSale);
  });
});

describe("DEALT -> FOR SALE", () => {
  it("succeeds if the actor is the seller", () => {
    const statefulItem = new StatefulItem({
      ...item,
      status: ItemStatus.Dealt,
    });
    statefulItem.transitionTo(ItemStatus.ForSale, me.simplifiedAccount);
    expect(statefulItem.getRepresentation().status).toEqual(ItemStatus.ForSale);
  });

  it("fails if the actor is not the seller", () => {
    const statefulItem = new StatefulItem({
      ...item,
      status: ItemStatus.Dealt,
    });
    expect(() =>
      statefulItem.transitionTo(ItemStatus.ForSale, someone.simplifiedAccount),
    ).toThrow(HTTPException);
    expect(statefulItem.getRepresentation().status).toEqual(ItemStatus.Dealt);
  });
});

describe("DEALT -> SOLD", () => {
  it("succeeds if the actor is the seller", () => {
    const statefulItem = new StatefulItem({
      ...item,
      status: ItemStatus.Dealt,
    });
    statefulItem.transitionTo(ItemStatus.Sold, me.simplifiedAccount);
    expect(statefulItem.getRepresentation().status).toEqual(ItemStatus.Sold);
  });

  it("fails if the actor is not the seller", () => {
    const statefulItem = new StatefulItem({
      ...item,
      status: ItemStatus.Dealt,
    });
    expect(() =>
      statefulItem.transitionTo(ItemStatus.Sold, someone.simplifiedAccount),
    ).toThrow(HTTPException);
    expect(statefulItem.getRepresentation().status).toEqual(ItemStatus.Dealt);
  });
});

describe("SOLD -> FOR SALE", () => {
  it("always fails", () => {
    const statefulItem = new StatefulItem({ ...item, status: ItemStatus.Sold });
    expect(() =>
      statefulItem.transitionTo(ItemStatus.ForSale, me.simplifiedAccount),
    ).toThrow(HTTPException);
    expect(() =>
      statefulItem.transitionTo(ItemStatus.ForSale, someone.simplifiedAccount),
    ).toThrow(HTTPException);
    expect(statefulItem.getRepresentation().status).toEqual(ItemStatus.Sold);
  });
});

describe("SOLD -> DEALT", () => {
  it("always fails", () => {
    const statefulItem = new StatefulItem({ ...item, status: ItemStatus.Sold });
    expect(() =>
      statefulItem.transitionTo(ItemStatus.Dealt, me.simplifiedAccount),
    ).toThrow(HTTPException);
    expect(() =>
      statefulItem.transitionTo(ItemStatus.Dealt, someone.simplifiedAccount),
    ).toThrow(HTTPException);
    expect(statefulItem.getRepresentation().status).toEqual(ItemStatus.Sold);
  });
});
