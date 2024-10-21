import { ItemStatus, ItemType, type ItemPack } from "@/types";
import { itemsCollection } from "@/utils/db";
import { publishItemEvent } from "@/utils/mq";
import { afterAll, expect, it, mock } from "bun:test";
import { me, someone } from "../../test-utils/mock-data";
import { DELETE } from "../../test-utils/request";

afterAll(async () => {
  await itemsCollection.deleteMany({ name: "test" });
});

it("decomposes a pack", async () => {
  mock.module("@/utils/mq", () => ({
    publishItemEvent: mock(),
  }));

  const itemPack: ItemPack = {
    id: crypto.randomUUID(),
    type: ItemType.Pack,
    seller: me.simplifiedAccount,
    name: "test",
    description: "test",
    price: 100,
    discount: 0,
    children: [
      {
        id: crypto.randomUUID(),
        type: ItemType.Single,
        seller: me.simplifiedAccount,
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
        seller: me.simplifiedAccount,
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
  await itemsCollection.insertOne(itemPack);

  const res = await DELETE(`/items/packs/${itemPack.id}`, {
    headers: {
      Cookie: `access_token=${me.jwt}`,
    },
  });
  expect(res.status).toEqual(204);
  expect(res.body).toBeEmpty();
  expect(await itemsCollection.findOne({ id: itemPack.id })).toMatchObject({
    deletedAt: expect.any(Date),
  });
  expect(
    await itemsCollection.countDocuments({ id: itemPack.children[0]!.id }),
  ).toEqual(1);
  expect(
    await itemsCollection.countDocuments({ id: itemPack.children[1]!.id }),
  ).toEqual(1);
  expect(publishItemEvent).toHaveBeenCalledTimes(1);
});

it("returns 401 if not authenticated", async () => {
  const res = await DELETE(`/items/packs/${crypto.randomUUID()}`);
  const body = await res.json();
  expect(res.status).toEqual(401);
  expect(body).toEqual({ error: expect.any(String) });
});

it("returns 403 if not the seller", async () => {
  const itemPack: ItemPack = {
    id: crypto.randomUUID(),
    type: ItemType.Pack,
    seller: someone.simplifiedAccount,
    name: "test",
    description: "test",
    price: 100,
    discount: 0,
    children: [],
    status: ItemStatus.ForSale,
    createdAt: new Date(),
    deletedAt: null,
  };
  await itemsCollection.insertOne(itemPack);

  const res = await DELETE(`/items/packs/${itemPack.id}`, {
    headers: {
      Cookie: `access_token=${me.jwt}`,
    },
  });
  const body = await res.json();
  expect(res.status).toEqual(403);
  expect(body).toEqual({ error: expect.any(String) });
});

it("returns 404 if not found", async () => {
  const res = await DELETE(`/items/packs/${crypto.randomUUID()}`, {
    headers: {
      Cookie: `access_token=${me.jwt}`,
    },
  });
  const body = await res.json();
  expect(res.status).toEqual(404);
  expect(body).toEqual({ error: expect.any(String) });
});
