import { ItemStatus, ItemType } from "@/types";
import { itemsCollection } from "@/utils/db";
import { expect, it } from "bun:test";
import { me, myJwt, someoneElse } from "../test-utils/mock-data";
import { DELETE } from "../test-utils/request";

it("takes down an item", async () => {
  const id = crypto.randomUUID();

  await itemsCollection.insertOne({
    id,
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

  const res = await DELETE(`/${id}`, {
    headers: {
      Cookie: `access_token=${myJwt}`,
    },
  });

  expect(res.status).toEqual(204);

  const item = await itemsCollection.findOne({ id });
  expect(item?.deletedAt).not.toBeNull();

  await itemsCollection.deleteOne({ id });
});

it("returns 400 if ID is invalid", async () => {
  const res = await DELETE(`/invalid`, {
    headers: {
      Cookie: `access_token=${myJwt}`,
    },
  });

  expect(res.status).toEqual(400);
});

it("returns 401 if user is not logged in", async () => {
  const res = await DELETE(`/invalid`);

  expect(res.status).toEqual(401);
});

it("returns 403 if user is not the seller", async () => {
  const id = crypto.randomUUID();

  await itemsCollection.insertOne({
    id,
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

  const res = await DELETE(`/${id}`, {
    headers: {
      Cookie: `access_token=${myJwt}`,
    },
  });

  expect(res.status).toEqual(403);

  await itemsCollection.deleteOne({ id });
});

it("returns 404 if item is not found", async () => {
  const id = crypto.randomUUID();

  const res = await DELETE(`/${id}`, {
    headers: {
      Cookie: `access_token=${myJwt}`,
    },
  });

  expect(res.status).toEqual(404);
});
