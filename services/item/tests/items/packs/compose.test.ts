import { ItemStatus, ItemType, type ItemPack, type SingleItem } from "@/types";
import { snakeToCamel } from "@/utils/case";
import { itemsCollection } from "@/utils/db";
import { afterAll, expect, it } from "bun:test";
import { me, someone } from "../../test-utils/mock-data";
import { POST } from "../../test-utils/request";

afterAll(async () => {
  await itemsCollection.deleteMany({ name: "test" });
});

it("composes items into pack", async () => {
  const singleItem1: SingleItem = {
    id: crypto.randomUUID(),
    type: ItemType.Single,
    seller: me.simplifiedAccount,
    name: "test",
    description: "test",
    price: 100,
    photoUrls: [],
    status: ItemStatus.ForSale,
    createdAt: new Date(),
    deletedAt: null,
  };
  const singleItem2: SingleItem = {
    id: crypto.randomUUID(),
    type: ItemType.Single,
    seller: me.simplifiedAccount,
    name: "test",
    description: "test",
    price: 200,
    photoUrls: [],
    status: ItemStatus.ForSale,
    createdAt: new Date(),
    deletedAt: null,
  };
  const singleItem3: SingleItem = {
    id: crypto.randomUUID(),
    type: ItemType.Single,
    seller: me.simplifiedAccount,
    name: "test",
    description: "test",
    price: 300,
    photoUrls: [],
    status: ItemStatus.ForSale,
    createdAt: new Date(),
    deletedAt: null,
  };

  await itemsCollection.insertMany([singleItem1, singleItem2, singleItem3]);

  const res1 = await POST(
    "/items/packs",
    {
      name: "test",
      description: "test",
      discount: 0.1,
      children_ids: [singleItem1.id, singleItem2.id],
    },
    {
      headers: {
        Cookie: `access_token=${me.jwt}`,
      },
    },
  );
  const body1 = snakeToCamel(await res1.json()) as ItemPack;
  expect(res1.status).toEqual(201);
  expect(body1).toEqual({
    id: expect.any(String),
    type: ItemType.Pack,
    seller: me.simplifiedAccount,
    name: "test",
    description: "test",
    price: (100 + 200) * 0.9,
    discount: 0.1,
    children: expect.arrayContaining([
      expect.objectContaining({ id: singleItem1.id }),
      expect.objectContaining({ id: singleItem2.id }),
    ]),
    status: ItemStatus.ForSale,
    createdAt: expect.any(String),
    deletedAt: null,
  });
  expect(
    await itemsCollection.countDocuments({
      id: singleItem1.id,
    }),
  ).toEqual(0);
  expect(
    await itemsCollection.countDocuments({
      id: singleItem2.id,
    }),
  ).toEqual(0);
  expect(
    await itemsCollection.countDocuments({
      id: body1.id,
    }),
  ).toEqual(1);

  const res2 = await POST(
    "/items/packs",
    {
      name: "test",
      description: "test",
      discount: 0.2,
      children_ids: [body1.id, singleItem3.id],
    },
    {
      headers: {
        Cookie: `access_token=${me.jwt}`,
      },
    },
  );
  const body2 = snakeToCamel(await res2.json()) as ItemPack;
  expect(res2.status).toEqual(201);
  expect(body2).toEqual({
    id: expect.any(String),
    type: ItemType.Pack,
    seller: me.simplifiedAccount,
    name: "test",
    description: "test",
    price: ((100 + 200) * 0.9 + 300) * 0.8,
    discount: 0.2,
    children: expect.arrayContaining([
      expect.objectContaining({ id: body1.id }),
      expect.objectContaining({ id: singleItem3.id }),
    ]),
    status: ItemStatus.ForSale,
    createdAt: expect.any(String),
    deletedAt: null,
  });
  expect(
    await itemsCollection.countDocuments({
      id: body1.id,
    }),
  ).toEqual(0);
  expect(
    await itemsCollection.countDocuments({
      id: singleItem3.id,
    }),
  ).toEqual(0);
  expect(
    await itemsCollection.countDocuments({
      id: body2.id,
    }),
  ).toEqual(1);
});

it("returns 400 if not enough children", async () => {
  const singleItem: SingleItem = {
    id: crypto.randomUUID(),
    type: ItemType.Single,
    seller: me.simplifiedAccount,
    name: "test",
    description: "test",
    price: 100,
    photoUrls: [],
    status: ItemStatus.ForSale,
    createdAt: new Date(),
    deletedAt: null,
  };
  await itemsCollection.insertOne(singleItem);

  const res = await POST(
    "/items/packs",
    {
      name: "test",
      description: "test",
      discount: 0.1,
      children_ids: [singleItem.id],
    },
    {
      headers: {
        Cookie: `access_token=${me.jwt}`,
      },
    },
  );
  const body = await res.json();
  expect(res.status).toEqual(400);
  expect(body).toEqual({ error: expect.any(String) });
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

it("returns 403 if some items are not owned by the user", async () => {
  const singleItem1: SingleItem = {
    id: crypto.randomUUID(),
    type: ItemType.Single,
    seller: me.simplifiedAccount,
    name: "test",
    description: "test",
    price: 100,
    photoUrls: [],
    status: ItemStatus.ForSale,
    createdAt: new Date(),
    deletedAt: null,
  };
  const singleItem2: SingleItem = {
    id: crypto.randomUUID(),
    type: ItemType.Single,
    seller: someone.simplifiedAccount,
    name: "test",
    description: "test",
    price: 200,
    photoUrls: [],
    status: ItemStatus.ForSale,
    createdAt: new Date(),
    deletedAt: null,
  };
  await itemsCollection.insertMany([singleItem1, singleItem2]);

  const res = await POST(
    "/items/packs",
    {
      name: "test",
      description: "test",
      discount: 0.1,
      children_ids: [singleItem1.id, singleItem2.id],
    },
    {
      headers: {
        Cookie: `access_token=${me.jwt}`,
      },
    },
  );
  const body = await res.json();
  expect(res.status).toEqual(403);
  expect(body).toEqual({ error: expect.any(String) });
});

it("returns 404 if some items do not exist", async () => {
  const res = await POST(
    "/items/packs",
    {
      name: "test",
      description: "test",
      discount: 0.1,
      children_ids: [
        "e8479c0e-3a72-4455-b985-cc72f2fd97e3",
        "233c1f6d-1ccb-4c1b-8189-9f440aa274c8",
      ],
    },
    {
      headers: {
        Cookie: `access_token=${me.jwt}`,
      },
    },
  );
  const body = await res.json();
  expect(res.status).toEqual(404);
  expect(body).toEqual({ error: expect.any(String) });
});
