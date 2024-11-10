import * as publish from "@/events/publish";
import { ItemStatus, ItemType, type ItemPack, type SingleItem } from "@/types";
import { itemsCollection } from "@/utils/db";
import { afterAll, afterEach, expect, it, mock, spyOn } from "bun:test";
import { jwt1, seller1, seller2 } from "../test-utils/data";
import { DELETE } from "../test-utils/request";

const mockPublishEvent = spyOn(publish, "publishEvent");

afterEach(() => {
  mockPublishEvent.mockClear();
});

afterAll(async () => {
  mock.restore();
  await itemsCollection.deleteMany({ name: "test" });
});

it("decomposes pack", async () => {
  const pack: ItemPack = {
    id: crypto.randomUUID(),
    type: ItemType.Pack,
    seller: seller1,
    name: "test",
    description: "test",
    price: 100,
    discount: 0,
    children: [
      {
        id: crypto.randomUUID(),
        type: ItemType.Single,
        seller: seller1,
        name: "test",
        description: "test",
        price: 70,
        photoUrls: [],
        status: ItemStatus.ForSale,
        createdAt: new Date(),
        deletedAt: null,
      },
      {
        id: crypto.randomUUID(),
        type: ItemType.Single,
        seller: seller1,
        name: "test",
        description: "test",
        price: 30,
        photoUrls: [],
        status: ItemStatus.ForSale,
        createdAt: new Date(),
        deletedAt: null,
      },
    ],
    status: ItemStatus.ForSale,
    createdAt: new Date(),
    deletedAt: null,
  };
  await itemsCollection.insertOne(pack);

  const res = await DELETE(`/items/packs/${pack.id}`, {
    headers: {
      Cookie: `access_token=${jwt1}`,
    },
  });
  expect(res.status).toEqual(204);
  expect(res.body).toBeEmpty();
  expect(
    await itemsCollection.countDocuments({
      id: pack.id,
      deletedAt: { $ne: null },
    }),
  ).toEqual(1);
  expect(
    await itemsCollection.countDocuments({ id: pack.children[0]!.id }),
  ).toEqual(1);
  expect(
    await itemsCollection.countDocuments({ id: pack.children[1]!.id }),
  ).toEqual(1);
  expect(mockPublishEvent).toHaveBeenLastCalledWith(
    "item",
    "item.deleted",
    pack.id,
  );
});

it("returns 401 if not logged in", async () => {
  const res = await DELETE(`/items/packs/${crypto.randomUUID()}`);
  const body = await res.json();

  expect(res.status).toEqual(401);
  expect(body).toEqual({ error: expect.any(String) });
});

it("returns 404 if pack not found", async () => {
  const res = await DELETE(`/items/packs/${crypto.randomUUID()}`, {
    headers: {
      Cookie: `access_token=${jwt1}`,
    },
  });
  const body = await res.json();

  expect(res.status).toEqual(404);
  expect(body).toEqual({ error: expect.any(String) });
});

it("returns 422 if not a pack", async () => {
  const item: SingleItem = {
    id: crypto.randomUUID(),
    type: ItemType.Single,
    seller: seller2,
    name: "test",
    description: "test",
    price: 100,
    photoUrls: [],
    status: ItemStatus.ForSale,
    createdAt: new Date(),
    deletedAt: null,
  };
  await itemsCollection.insertOne(item);

  const res = await DELETE(`/items/packs/${item.id}`, {
    headers: {
      Cookie: `access_token=${jwt1}`,
    },
  });
  const body = await res.json();

  expect(res.status).toEqual(422);
  expect(body).toEqual({ error: expect.any(String) });
});

it("returns 403 if not the seller", async () => {
  const pack: ItemPack = {
    id: crypto.randomUUID(),
    type: ItemType.Pack,
    seller: seller2,
    name: "test",
    description: "test",
    price: 100,
    discount: 0,
    children: [],
    status: ItemStatus.ForSale,
    createdAt: new Date(),
    deletedAt: null,
  };
  await itemsCollection.insertOne(pack);

  const res = await DELETE(`/items/packs/${pack.id}`, {
    headers: {
      Cookie: `access_token=${jwt1}`,
    },
  });
  const body = await res.json();

  expect(res.status).toEqual(403);
  expect(body).toEqual({ error: expect.any(String) });
});
