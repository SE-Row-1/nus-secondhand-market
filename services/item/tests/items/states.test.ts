import { StatefulItem } from "@/items/states";
import { ItemStatus, ItemType, type Item } from "@/types";
import { describe, expect, it } from "bun:test";
import { HTTPException } from "hono/http-exception";
import { me, someoneElse } from "../test-utils/mock-data";

const item: Item = {
  id: "0",
  type: ItemType.SINGLE,
  name: "test",
  description: "test",
  price: 100,
  photoUrls: [],
  status: ItemStatus.FOR_SALE,
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
    statefulItem.transitionTo(ItemStatus.DEALT, me);
    expect(statefulItem.getRepresentation().status).toEqual(ItemStatus.DEALT);
  });

  it("fails if the actor is not the seller", () => {
    const statefulItem = new StatefulItem(item);
    expect(() =>
      statefulItem.transitionTo(ItemStatus.DEALT, someoneElse),
    ).toThrow(HTTPException);
    expect(statefulItem.getRepresentation().status).toEqual(
      ItemStatus.FOR_SALE,
    );
  });
});

describe("FOR SALE -> SOLD", () => {
  it("always fails", () => {
    const statefulItem = new StatefulItem(item);
    expect(() => statefulItem.transitionTo(ItemStatus.SOLD, me)).toThrow(
      HTTPException,
    );
    expect(() =>
      statefulItem.transitionTo(ItemStatus.SOLD, someoneElse),
    ).toThrow(HTTPException);
    expect(statefulItem.getRepresentation().status).toEqual(
      ItemStatus.FOR_SALE,
    );
  });
});

describe("DEALT -> FOR SALE", () => {
  it("succeeds if the actor is the seller", () => {
    const statefulItem = new StatefulItem({
      ...item,
      status: ItemStatus.DEALT,
    });
    statefulItem.transitionTo(ItemStatus.FOR_SALE, me);
    expect(statefulItem.getRepresentation().status).toEqual(
      ItemStatus.FOR_SALE,
    );
  });

  it("fails if the actor is not the seller", () => {
    const statefulItem = new StatefulItem({
      ...item,
      status: ItemStatus.DEALT,
    });
    expect(() =>
      statefulItem.transitionTo(ItemStatus.FOR_SALE, someoneElse),
    ).toThrow(HTTPException);
    expect(statefulItem.getRepresentation().status).toEqual(ItemStatus.DEALT);
  });
});

describe("DEALT -> SOLD", () => {
  it("succeeds if the actor is the seller", () => {
    const statefulItem = new StatefulItem({
      ...item,
      status: ItemStatus.DEALT,
    });
    statefulItem.transitionTo(ItemStatus.SOLD, me);
    expect(statefulItem.getRepresentation().status).toEqual(ItemStatus.SOLD);
  });

  it("fails if the actor is not the seller", () => {
    const statefulItem = new StatefulItem({
      ...item,
      status: ItemStatus.DEALT,
    });
    expect(() =>
      statefulItem.transitionTo(ItemStatus.SOLD, someoneElse),
    ).toThrow(HTTPException);
    expect(statefulItem.getRepresentation().status).toEqual(ItemStatus.DEALT);
  });
});

describe("SOLD -> FOR SALE", () => {
  it("always fails", () => {
    const statefulItem = new StatefulItem({ ...item, status: ItemStatus.SOLD });
    expect(() => statefulItem.transitionTo(ItemStatus.FOR_SALE, me)).toThrow(
      HTTPException,
    );
    expect(() =>
      statefulItem.transitionTo(ItemStatus.FOR_SALE, someoneElse),
    ).toThrow(HTTPException);
    expect(statefulItem.getRepresentation().status).toEqual(ItemStatus.SOLD);
  });
});

describe("SOLD -> DEALT", () => {
  it("always fails", () => {
    const statefulItem = new StatefulItem({ ...item, status: ItemStatus.SOLD });
    expect(() => statefulItem.transitionTo(ItemStatus.DEALT, me)).toThrow(
      HTTPException,
    );
    expect(() =>
      statefulItem.transitionTo(ItemStatus.DEALT, someoneElse),
    ).toThrow(HTTPException);
    expect(statefulItem.getRepresentation().status).toEqual(ItemStatus.SOLD);
  });
});
