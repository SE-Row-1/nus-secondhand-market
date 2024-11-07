import * as publish from "@/events/publish";
import { ItemStatus, ItemType } from "@/types";
import { itemsCollection } from "@/utils/db";
import { afterAll, afterEach, expect, it, mock, spyOn } from "bun:test";
import { jwt1, jwt2, seller1 } from "../test-utils/data";
import { DELETE } from "../test-utils/request";

const mockPublishEvent = spyOn(publish, "publishEvent");

afterEach(() => {
  mockPublishEvent.mockClear();
});

afterAll(async () => {
  mock.restore();
  await itemsCollection.deleteMany({ name: "test" });
});

it("takes down item", async () => {
  const id = crypto.randomUUID();
  await itemsCollection.insertOne({
    id,
    type: ItemType.Single,
    seller: seller1,
    name: "test",
    description: "test",
    price: 100,
    photoUrls: [],
    status: ItemStatus.ForSale,
    createdAt: new Date(),
    deletedAt: null,
  });

  const res = await DELETE(`/items/${id}`, {
    headers: {
      Cookie: `access_token=${jwt1}`,
    },
  });

  expect(res.status).toEqual(204);
  expect(res.body).toBeEmpty();
  expect(
    await itemsCollection.countDocuments({ id, deletedAt: { $ne: null } }),
  ).toEqual(1);
  expect(mockPublishEvent).toHaveBeenLastCalledWith("item", "item.deleted", id);
});

it("returns 401 if not logged in", async () => {
  const res = await DELETE(`/items/${crypto.randomUUID()}`);
  const body = await res.json();

  expect(res.status).toEqual(401);
  expect(body).toEqual({ error: expect.any(String) });
});

it("returns 404 if item is not found", async () => {
  const res = await DELETE("/items/00000000-0000-0000-0000-000000000000", {
    headers: {
      Cookie: `access_token=${jwt1}`,
    },
  });
  const body = await res.json();

  expect(res.status).toEqual(404);
  expect(body).toMatchObject({ error: expect.any(String) });
});

it("returns 422 if item type is not single", async () => {
  const id = crypto.randomUUID();
  await itemsCollection.insertOne({
    id,
    type: ItemType.Pack,
    seller: seller1,
    name: "test",
    description: "test",
    price: 100,
    discount: 0,
    children: [],
    status: ItemStatus.ForSale,
    createdAt: new Date(),
    deletedAt: null,
  });

  const res = await DELETE(`/items/${id}`, {
    headers: {
      Cookie: `access_token=${jwt1}`,
    },
  });
  const body = await res.json();

  expect(res.status).toEqual(422);
  expect(body).toEqual({ error: expect.any(String) });
});

it("returns 403 if user is not seller", async () => {
  const id = crypto.randomUUID();
  await itemsCollection.insertOne({
    id,
    type: ItemType.Single,
    seller: seller1,
    name: "test",
    description: "test",
    price: 100,
    photoUrls: [],
    status: ItemStatus.ForSale,
    createdAt: new Date(),
    deletedAt: null,
  });

  const res = await DELETE(`/items/${id}`, {
    headers: {
      Cookie: `access_token=${jwt2}`,
    },
  });
  const body = await res.json();

  expect(res.status).toEqual(403);
  expect(body).toEqual({ error: expect.any(String) });
});
