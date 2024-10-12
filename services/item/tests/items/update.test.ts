import { ItemStatus, ItemType } from "@/types";
import { itemsCollection } from "@/utils/db";
import { expect, it } from "bun:test";
import { existsSync } from "fs";
import { rm } from "fs/promises";
import { me, myJwt, someoneElse } from "../test-utils/mock-data";
import { PATCH_FORM } from "../test-utils/request";

it("updates an item", async () => {
  await Bun.write("uploads/before-update.png", "");

  const insertedId = crypto.randomUUID();

  await itemsCollection.insertOne({
    id: insertedId,
    type: ItemType.SINGLE,
    name: "test",
    description: "test",
    price: 100,
    photoUrls: ["uploads/before-update.png"],
    seller: {
      id: me.id,
      nickname: me.nickname,
      avatarUrl: me.avatarUrl,
    },
    status: ItemStatus.FOR_SALE,
    createdAt: new Date(),
    deletedAt: null,
  });

  const formData = new FormData();
  formData.append("name", "update");
  formData.append("description", "update");
  formData.append("price", "200");
  formData.append(
    "added_photos",
    new File(["foo"], "after-update.png", { type: "image/png" }),
    "after-update.png",
  );
  formData.append("removed_photo_urls", "uploads/before-update.png");

  const res = await PATCH_FORM(`/items/${insertedId}`, formData, {
    headers: {
      Cookie: `access_token=${myJwt}`,
    },
  });
  const body = await res.json();

  expect(res.status).toEqual(200);
  expect(body).toMatchObject({
    id: insertedId,
    type: ItemType.SINGLE,
    name: "update",
    description: "update",
    price: 200,
    photo_urls: ["uploads/after-update.png"],
    seller: {
      id: me.id,
      nickname: me.nickname,
      avatar_url: me.avatarUrl,
    },
    status: ItemStatus.FOR_SALE,
    created_at: expect.any(String),
    deleted_at: null,
  });
  expect(body).not.toContainKey("_id");
  expect(existsSync("uploads/before-update.png")).toBeFalse();
  expect(existsSync("uploads/after-update.png")).toBeTrue();
  expect(
    await itemsCollection.countDocuments({ id: insertedId, name: "update" }),
  ).toEqual(1);

  await rm("uploads/after-update.png");
  await itemsCollection.deleteOne({ id: insertedId });
});

it("returns 400 if the item ID is invalid", async () => {
  const res = await PATCH_FORM("/items/foo", new FormData(), {
    headers: {
      Cookie: `access_token=${myJwt}`,
    },
  });
  const body = await res.json();

  expect(res.status).toEqual(400);
  expect(body).toMatchObject({ error: expect.any(String) });
});

it("returns 400 if the request body is invalid", async () => {
  const formData = new FormData();
  formData.append("name", "");
  formData.append("description", "");
  formData.append("price", "-1");

  const res = await PATCH_FORM(
    "/items/00000000-0000-0000-0000-000000000000",
    formData,
    {
      headers: {
        Cookie: `access_token=${myJwt}`,
      },
    },
  );
  const body = await res.json();

  expect(res.status).toEqual(400);
  expect(body).toMatchObject({ error: expect.any(String) });
});

it("returns 400 if photo number exceeds the limit", async () => {
  const insertedId = crypto.randomUUID();

  await itemsCollection.insertOne({
    id: insertedId,
    type: ItemType.SINGLE,
    name: "test",
    description: "test",
    price: 100,
    photoUrls: [
      "uploads/1.png",
      "uploads/2.png",
      "uploads/3.png",
      "uploads/4.png",
      "uploads/5.png",
    ],
    seller: {
      id: me.id,
      nickname: me.nickname,
      avatarUrl: me.avatarUrl,
    },
    status: ItemStatus.FOR_SALE,
    createdAt: new Date(),
    deletedAt: null,
  });

  const formData = new FormData();
  formData.append("name", "update");
  formData.append("description", "update");
  formData.append("price", "200");
  formData.append(
    "added_photos",
    new File(["foo"], "6.png", { type: "image/png" }),
    "6.png",
  );

  const res = await PATCH_FORM(`/items/${insertedId}`, formData, {
    headers: {
      Cookie: `access_token=${myJwt}`,
    },
  });
  const body = await res.json();

  expect(res.status).toEqual(400);
  expect(body).toMatchObject({ error: expect.any(String) });

  await itemsCollection.deleteOne({ id: insertedId });
});

it("returns 400 if the removed photo URL does not exist", async () => {
  const insertedId = crypto.randomUUID();

  await itemsCollection.insertOne({
    id: insertedId,
    type: ItemType.SINGLE,
    name: "test",
    description: "test",
    price: 100,
    photoUrls: ["uploads/1.png"],
    seller: {
      id: me.id,
      nickname: me.nickname,
      avatarUrl: me.avatarUrl,
    },
    status: ItemStatus.FOR_SALE,
    createdAt: new Date(),
    deletedAt: null,
  });

  const formData = new FormData();
  formData.append("removed_photo_urls", "uploads/2.png");

  const res = await PATCH_FORM(`/items/${insertedId}`, formData, {
    headers: {
      Cookie: `access_token=${myJwt}`,
    },
  });
  const body = await res.json();

  expect(res.status).toEqual(400);
  expect(body).toMatchObject({ error: expect.any(String) });

  await itemsCollection.deleteOne({ id: insertedId });
});

it("returns 401 if the user is not authenticated", async () => {
  const res = await PATCH_FORM(
    "/items/00000000-0000-0000-0000-000000000000",
    new FormData(),
  );
  const body = await res.json();

  expect(res.status).toEqual(401);
  expect(body).toMatchObject({ error: expect.any(String) });
});

it("returns 403 if the user is not the seller of the item", async () => {
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

  const res = await PATCH_FORM(`/items/${insertedId}`, new FormData(), {
    headers: {
      Cookie: `access_token=${myJwt}`,
    },
  });
  const body = await res.json();

  expect(res.status).toEqual(403);
  expect(body).toMatchObject({ error: expect.any(String) });

  await itemsCollection.deleteOne({ id: insertedId });
});

it("returns 404 if the item does not exist", async () => {
  const res = await PATCH_FORM(
    "/items/00000000-0000-0000-0000-000000000000",
    new FormData(),
    {
      headers: {
        Cookie: `access_token=${myJwt}`,
      },
    },
  );
  const body = await res.json();

  expect(res.status).toEqual(404);
  expect(body).toMatchObject({ error: expect.any(String) });
});

it("returns 422 if the item is not a single item", async () => {
  const insertedId = crypto.randomUUID();

  await itemsCollection.insertOne({
    id: insertedId,
    type: ItemType.PACK,
    name: "test",
    description: "test",
    seller: {
      id: me.id,
      nickname: me.nickname,
      avatarUrl: me.avatarUrl,
    },
    discount: 0,
    children: [],
    status: ItemStatus.FOR_SALE,
    createdAt: new Date(),
    deletedAt: null,
  });

  const res = await PATCH_FORM(`/items/${insertedId}`, new FormData(), {
    headers: {
      Cookie: `access_token=${myJwt}`,
    },
  });
  const body = await res.json();

  expect(res.status).toEqual(422);
  expect(body).toMatchObject({ error: expect.any(String) });

  await itemsCollection.deleteOne({ id: insertedId });
});
