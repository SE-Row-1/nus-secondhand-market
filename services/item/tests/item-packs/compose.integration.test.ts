import { ItemStatus, ItemType, type ItemPack, type SingleItem } from "@/types";
import { snakeToCamel } from "@/utils/case";
import { itemsCollection } from "@/utils/db";
import { afterAll, expect, it } from "bun:test";
import { jwt1, seller1, seller2 } from "../test-utils/data";
import { POST } from "../test-utils/request";

afterAll(async () => {
  await itemsCollection.deleteMany({ name: "test" });
});

it("composes pack", async () => {
  const item1: SingleItem = {
    id: crypto.randomUUID(),
    type: ItemType.Single,
    seller: seller1,
    name: "test",
    description: "test",
    price: 100,
    photoUrls: [],
    status: ItemStatus.ForSale,
    createdAt: new Date(),
    deletedAt: null,
  };
  const item2: SingleItem = {
    id: crypto.randomUUID(),
    type: ItemType.Single,
    seller: seller1,
    name: "test",
    description: "test",
    price: 200,
    photoUrls: [],
    status: ItemStatus.ForSale,
    createdAt: new Date(),
    deletedAt: null,
  };
  const item3: SingleItem = {
    id: crypto.randomUUID(),
    type: ItemType.Single,
    seller: seller1,
    name: "test",
    description: "test",
    price: 300,
    photoUrls: [],
    status: ItemStatus.ForSale,
    createdAt: new Date(),
    deletedAt: null,
  };
  await itemsCollection.insertMany([item1, item2, item3]);

  const res1 = await POST(
    "/items/packs",
    {
      name: "test",
      description: "test",
      discount: 0.1,
      children_ids: [item1.id, item2.id],
    },
    {
      headers: {
        Cookie: `access_token=${jwt1}`,
      },
    },
  );
  const body1 = snakeToCamel(await res1.json()) as ItemPack;

  expect(res1.status).toEqual(201);
  expect(body1).toEqual({
    id: expect.any(String),
    type: ItemType.Pack,
    name: "test",
    description: "test",
    price: (100 + 200) * 0.9,
    discount: 0.1,
    children: [
      expect.objectContaining({ id: item1.id }),
      expect.objectContaining({ id: item2.id }),
    ],
    seller: seller1,
    status: ItemStatus.ForSale,
    createdAt: expect.any(String),
    deletedAt: null,
  });
  expect(await itemsCollection.countDocuments({ id: item1.id })).toEqual(0);
  expect(await itemsCollection.countDocuments({ id: item2.id })).toEqual(0);
  expect(await itemsCollection.countDocuments({ id: body1.id })).toEqual(1);

  const res2 = await POST(
    "/items/packs",
    {
      name: "test",
      description: "test",
      discount: 0.2,
      children_ids: [body1.id, item3.id],
    },
    {
      headers: {
        Cookie: `access_token=${jwt1}`,
      },
    },
  );
  const body2 = snakeToCamel(await res2.json()) as ItemPack;

  expect(res2.status).toEqual(201);
  expect(body2).toEqual({
    id: expect.any(String),
    type: ItemType.Pack,
    seller: seller1,
    name: "test",
    description: "test",
    price: ((100 + 200) * 0.9 + 300) * 0.8,
    discount: 0.2,
    children: [
      expect.objectContaining({ id: item3.id }),
      expect.objectContaining({ id: body1.id }),
    ],
    status: ItemStatus.ForSale,
    createdAt: expect.any(String),
    deletedAt: null,
  });
  expect(await itemsCollection.countDocuments({ id: body1.id })).toEqual(0);
  expect(await itemsCollection.countDocuments({ id: item3.id })).toEqual(0);
  expect(await itemsCollection.countDocuments({ id: body2.id })).toEqual(1);
});

it("returns 401 if not logged in", async () => {
  const res = await POST("/items/packs", {
    name: "test",
    description: "test",
    discount: 0.1,
    children_ids: [],
  });
  const body = await res.json();

  expect(res.status).toEqual(401);
  expect(body).toEqual({ error: expect.any(String) });
});

it("returns 404 if some items do not exist", async () => {
  const res = await POST(
    "/items/packs",
    {
      name: "test",
      description: "test",
      discount: 0.1,
      children_ids: [crypto.randomUUID(), crypto.randomUUID()],
    },
    {
      headers: {
        Cookie: `access_token=${jwt1}`,
      },
    },
  );
  const body = await res.json();

  expect(res.status).toEqual(404);
  expect(body).toEqual({ error: expect.any(String) });
});

it("returns 403 if not every item's seller", async () => {
  const item1: SingleItem = {
    id: crypto.randomUUID(),
    type: ItemType.Single,
    seller: seller1,
    name: "test",
    description: "test",
    price: 100,
    photoUrls: [],
    status: ItemStatus.ForSale,
    createdAt: new Date(),
    deletedAt: null,
  };
  const item2: SingleItem = {
    id: crypto.randomUUID(),
    type: ItemType.Single,
    seller: seller2,
    name: "test",
    description: "test",
    price: 200,
    photoUrls: [],
    status: ItemStatus.ForSale,
    createdAt: new Date(),
    deletedAt: null,
  };
  await itemsCollection.insertMany([item1, item2]);

  const res = await POST(
    "/items/packs",
    {
      name: "test",
      description: "test",
      discount: 0.1,
      children_ids: [item1.id, item2.id],
    },
    {
      headers: {
        Cookie: `access_token=${jwt1}`,
      },
    },
  );
  const body = await res.json();

  expect(res.status).toEqual(403);
  expect(body).toEqual({ error: expect.any(String) });
});
