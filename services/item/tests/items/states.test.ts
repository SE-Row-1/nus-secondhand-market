import { StatefulItem } from "@/items/states";
import { ItemStatus, ItemType, type Item } from "@/types";
import { describe, expect, it } from "bun:test";
import { HTTPException } from "hono/http-exception";
import { me, someoneElse } from "../test-utils/mock-data";

const item: Item = {
  id: "0",
  type: ItemType.Single,
  name: "test",
  description: "test",
  price: 100,
  photoUrls: [],
  status: ItemStatus.ForSale,
  seller: {
    id: me.id,
    nickname: me.nickname,
    avatarUrl: me.avatarUrl,
  },
  createdAt: new Date(),
  deletedAt: null,
};

describe("FOR SALE -> DEALT", () => {
  it("succeeds if the actor is the seller", () => {
    const statefulItem = new StatefulItem(item);
    statefulItem.transitionTo(ItemStatus.Dealt, me);
    expect(statefulItem.getRepresentation().status).toEqual(ItemStatus.Dealt);
  });

  it("fails if the actor is not the seller", () => {
    const statefulItem = new StatefulItem(item);
    expect(() =>
      statefulItem.transitionTo(ItemStatus.Dealt, someoneElse),
    ).toThrow(HTTPException);
    expect(statefulItem.getRepresentation().status).toEqual(ItemStatus.ForSale);
  });
});

describe("FOR SALE -> SOLD", () => {
  it("always fails", () => {
    const statefulItem = new StatefulItem(item);
    expect(() => statefulItem.transitionTo(ItemStatus.Sold, me)).toThrow(
      HTTPException,
    );
    expect(() =>
      statefulItem.transitionTo(ItemStatus.Sold, someoneElse),
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
    statefulItem.transitionTo(ItemStatus.ForSale, me);
    expect(statefulItem.getRepresentation().status).toEqual(ItemStatus.ForSale);
  });

  it("fails if the actor is not the seller", () => {
    const statefulItem = new StatefulItem({
      ...item,
      status: ItemStatus.Dealt,
    });
    expect(() =>
      statefulItem.transitionTo(ItemStatus.ForSale, someoneElse),
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
    statefulItem.transitionTo(ItemStatus.Sold, me);
    expect(statefulItem.getRepresentation().status).toEqual(ItemStatus.Sold);
  });

  it("fails if the actor is not the seller", () => {
    const statefulItem = new StatefulItem({
      ...item,
      status: ItemStatus.Dealt,
    });
    expect(() =>
      statefulItem.transitionTo(ItemStatus.Sold, someoneElse),
    ).toThrow(HTTPException);
    expect(statefulItem.getRepresentation().status).toEqual(ItemStatus.Dealt);
  });
});

describe("SOLD -> FOR SALE", () => {
  it("always fails", () => {
    const statefulItem = new StatefulItem({ ...item, status: ItemStatus.Sold });
    expect(() => statefulItem.transitionTo(ItemStatus.ForSale, me)).toThrow(
      HTTPException,
    );
    expect(() =>
      statefulItem.transitionTo(ItemStatus.ForSale, someoneElse),
    ).toThrow(HTTPException);
    expect(statefulItem.getRepresentation().status).toEqual(ItemStatus.Sold);
  });
});

describe("SOLD -> DEALT", () => {
  it("always fails", () => {
    const statefulItem = new StatefulItem({ ...item, status: ItemStatus.Sold });
    expect(() => statefulItem.transitionTo(ItemStatus.Dealt, me)).toThrow(
      HTTPException,
    );
    expect(() =>
      statefulItem.transitionTo(ItemStatus.Dealt, someoneElse),
    ).toThrow(HTTPException);
    expect(statefulItem.getRepresentation().status).toEqual(ItemStatus.Sold);
  });
});
