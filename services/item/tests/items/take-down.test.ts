import { ItemStatus, ItemType } from "@/types";
import { itemsCollection } from "@/utils/db";
import { expect, it } from "bun:test";
import { me, myJwt, someoneElse } from "../test-utils/mock-data";
import { DELETE } from "../test-utils/request";

it.only("takes down an item", async () => {
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

  const res = await DELETE(`/items/${insertedId}`, {
    headers: {
      Cookie: `access_token=${myJwt}`,
    },
  });
  const body = await res.text();

  expect(res.status).toEqual(204);
  expect(body).toBeEmpty();

  const item = await itemsCollection.findOne({ id: insertedId });
  expect(item?.deletedAt).toBeDate();

  await itemsCollection.deleteOne({ id: insertedId });
});

it("returns 400 if ID is not a UUID", async () => {
  const res = await DELETE("/items/invalid", {
    headers: {
      Cookie: `access_token=${myJwt}`,
    },
  });
  const body = await res.json();

  expect(res.status).toEqual(400);
  expect(body).toMatchObject({ error: expect.any(String) });
});

it("returns 401 if user is not authenticated", async () => {
  const res = await DELETE("/items/00000000-0000-0000-0000-000000000000");
  const body = await res.json();

  expect(res.status).toEqual(401);
  expect(body).toMatchObject({ error: expect.any(String) });
});

it("returns 401 if JWT is invalid", async () => {
  const res = await DELETE("/items/00000000-0000-0000-0000-000000000000", {
    headers: {
      Cookie: `access_token=invalid`,
    },
  });
  const body = await res.json();

  expect(res.status).toEqual(401);
  expect(body).toMatchObject({ error: expect.any(String) });
});

it("returns 403 if user is not the seller", async () => {
  const insertedId = crypto.randomUUID();

  await itemsCollection.insertOne({
    id: insertedId,
    type: ItemType.SINGLE,
    name: "test",
    description: "test",
    price: 100,
    photoUrls: [],
    seller: {
      id: someoneElse.id,
      nickname: someoneElse.nickname,
      avatarUrl: someoneElse.avatarUrl,
    },
    status: ItemStatus.FOR_SALE,
    createdAt: new Date(),
    deletedAt: null,
  });

  const res = await DELETE(`/items/${insertedId}`, {
    headers: {
      Cookie: `access_token=${myJwt}`,
    },
  });
  const body = await res.json();

  expect(res.status).toEqual(403);
  expect(body).toMatchObject({ error: expect.any(String) });

  await itemsCollection.deleteOne({ id: insertedId });
});

it("returns 404 if item is not found", async () => {
  const res = await DELETE("/items/00000000-0000-0000-0000-000000000000", {
    headers: {
      Cookie: `access_token=${myJwt}`,
    },
  });
  const body = await res.json();

  expect(res.status).toEqual(404);
  expect(body).toMatchObject({ error: expect.any(String) });
});
