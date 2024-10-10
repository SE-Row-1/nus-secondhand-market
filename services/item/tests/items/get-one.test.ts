import { ItemStatus, ItemType } from "@/types";
import { itemsCollection } from "@/utils/db";
import { expect, it, mock } from "bun:test";
import { me } from "../test-utils/mock-data";
import { GET } from "../test-utils/request";

mock.module("@/utils/requester", () => ({
  createRequester: () => () => me,
}));

it("returns the item with the given ID", async () => {
  const insertedId = crypto.randomUUID();

  await itemsCollection.insertOne({
    id: insertedId,
    type: ItemType.SINGLE,
    name: "test",
    description: "test",
    price: 100,
    photoUrls: [],
    seller: {
      id: me.id,
      nickname: me.nickname,
      avatarUrl: me.avatarUrl,
    },
    status: ItemStatus.FOR_SALE,
    createdAt: new Date(),
    deletedAt: null,
  });

  const res = await GET(`/items/${insertedId}`);
  const body = await res.json();

  expect(res.status).toEqual(200);
  expect(body).toMatchObject({
    id: insertedId,
    seller: expect.objectContaining({ id: me.id, email: me.email }),
  });

  await itemsCollection.deleteOne({ id: insertedId });
});

it("ignores deleted items", async () => {
  const deletedId = crypto.randomUUID();

  await itemsCollection.insertOne({
    id: deletedId,
    type: ItemType.SINGLE,
    name: "test",
    description: "test",
    price: 100,
    photoUrls: [],
    seller: {
      id: me.id,
      nickname: me.nickname,
      avatarUrl: me.avatarUrl,
    },
    status: ItemStatus.FOR_SALE,
    createdAt: new Date(),
    deletedAt: new Date(),
  });

  const res = await GET(`/items/${deletedId}`);
  const body = await res.json();

  expect(res.status).toEqual(404);
  expect(body).toMatchObject({ error: expect.any(String) });
});

it("returns 400 if ID is not a UUID", async () => {
  const res = await GET("/items/foo");
  const body = await res.json();

  expect(res.status).toEqual(400);
  expect(body).toMatchObject({ error: expect.any(String) });
});
