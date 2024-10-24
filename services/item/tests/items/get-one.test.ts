import { ItemStatus, ItemType } from "@/types";
import { itemsCollection } from "@/utils/db";
import { afterAll, beforeAll, expect, it, mock } from "bun:test";
import { me } from "../test-utils/mock-data";
import { GET } from "../test-utils/request";

const mockFetch = mock().mockImplementation(
  async () => new Response(JSON.stringify(me.detailedAccount), { status: 200 }),
);

beforeAll(() => {
  global.fetch = mockFetch;
});

afterAll(() => {
  mock.restore();
});

it("returns the item with the given ID", async () => {
  const insertedId = crypto.randomUUID();

  await itemsCollection.insertOne({
    id: insertedId,
    type: ItemType.Single,
    name: "test",
    description: "test",
    price: 100,
    photoUrls: [],
    seller: me.simplifiedAccount,
    status: ItemStatus.ForSale,
    createdAt: new Date(),
    deletedAt: null,
  });

  const res = await GET(`/items/${insertedId}`);
  const body = await res.json();

  expect(res.status).toEqual(200);
  expect(body).toMatchObject({
    id: insertedId,
    seller: me.detailed_account,
  });
  expect(body).not.toContainKey("_id");

  await itemsCollection.deleteOne({ id: insertedId });
});

it("ignores deleted items", async () => {
  const deletedId = crypto.randomUUID();

  await itemsCollection.insertOne({
    id: deletedId,
    type: ItemType.Single,
    name: "test",
    description: "test",
    price: 100,
    photoUrls: [],
    seller: me.simplifiedAccount,
    status: ItemStatus.ForSale,
    createdAt: new Date(),
    deletedAt: new Date(),
  });

  const res = await GET(`/items/${deletedId}`);
  const body = await res.json();

  expect(res.status).toEqual(404);
  expect(body).toMatchObject({ error: expect.any(String) });

  await itemsCollection.deleteOne({ id: deletedId });
});

it("returns 400 if ID is not a UUID", async () => {
  const res = await GET("/items/foo");
  const body = await res.json();

  expect(res.status).toEqual(400);
  expect(body).toMatchObject({ error: expect.any(String) });
});
