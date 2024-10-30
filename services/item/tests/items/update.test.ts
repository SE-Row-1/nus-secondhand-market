import { publishItemUpdatedEvent } from "@/events/publish-item-updated-event";
import { ItemStatus, ItemType, type SingleItem } from "@/types";
import type { CamelToSnake } from "@/utils/case";
import { itemsCollection } from "@/utils/db";
import { beforeAll, expect, it, mock } from "bun:test";
import { existsSync } from "fs";
import { mkdir, rm } from "fs/promises";
import { me, someone } from "../test-utils/data";
import { PATCH_FORM } from "../test-utils/request";

beforeAll(async () => {
  if (!existsSync("uploads")) {
    await mkdir("uploads");
  }
});

it("updates an item", async () => {
  mock.module("@/events/publish-item-updated-event", () => ({
    publishItemUpdatedEvent: mock(),
  }));

  await Bun.write("uploads/test.png", "");

  const insertedId = crypto.randomUUID();

  await itemsCollection.insertOne({
    id: insertedId,
    type: ItemType.Single,
    name: "test",
    description: "test",
    price: 100,
    photoUrls: ["uploads/test.png"],
    seller: me.simplifiedAccount,
    status: ItemStatus.ForSale,
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
  formData.append("removed_photo_urls", "uploads/test.png");

  const res = await PATCH_FORM(`/items/${insertedId}`, formData, {
    headers: {
      Cookie: `access_token=${me.jwt}`,
    },
  });
  const body = (await res.json()) as CamelToSnake<SingleItem>;

  expect(res.status).toEqual(200);
  expect(body).toEqual(
    expect.objectContaining({
      id: insertedId,
      type: ItemType.Single,
      name: "update",
      description: "update",
      price: 200,
      photo_urls: [expect.stringMatching(/^uploads\/.+\.png$/)],
      seller: me.simplified_account,
      status: ItemStatus.ForSale,
      created_at: expect.any(String),
      deleted_at: null,
    }),
  );
  expect(body).not.toContainKey("_id");
  expect(existsSync("uploads/test.png")).toBeFalse();
  expect(existsSync(body.photo_urls?.[0] ?? "")).toBeTrue();
  expect(
    await itemsCollection.countDocuments({ id: insertedId, name: "update" }),
  ).toEqual(1);
  expect(publishItemUpdatedEvent).toHaveBeenCalledTimes(1);

  await rm("uploads", { recursive: true });
  await itemsCollection.deleteOne({ id: insertedId });
});

it("returns 400 if the item ID is invalid", async () => {
  const res = await PATCH_FORM("/items/foo", new FormData(), {
    headers: {
      Cookie: `access_token=${me.jwt}`,
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
        Cookie: `access_token=${me.jwt}`,
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
    type: ItemType.Single,
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
    seller: me.simplifiedAccount,
    status: ItemStatus.ForSale,
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
      Cookie: `access_token=${me.jwt}`,
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
    type: ItemType.Single,
    name: "test",
    description: "test",
    price: 100,
    photoUrls: ["uploads/1.png"],
    seller: me.simplifiedAccount,
    status: ItemStatus.ForSale,
    createdAt: new Date(),
    deletedAt: null,
  });

  const formData = new FormData();
  formData.append("removed_photo_urls", "uploads/2.png");

  const res = await PATCH_FORM(`/items/${insertedId}`, formData, {
    headers: {
      Cookie: `access_token=${me.jwt}`,
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
    type: ItemType.Single,
    name: "test",
    description: "test",
    price: 100,
    photoUrls: [],
    seller: someone.simplifiedAccount,
    status: ItemStatus.ForSale,
    createdAt: new Date(),
    deletedAt: null,
  });

  const res = await PATCH_FORM(`/items/${insertedId}`, new FormData(), {
    headers: {
      Cookie: `access_token=${me.jwt}`,
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
        Cookie: `access_token=${me.jwt}`,
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
    type: ItemType.Pack,
    name: "test",
    description: "test",
    seller: me.simplifiedAccount,
    price: 0,
    discount: 0,
    children: [],
    status: ItemStatus.ForSale,
    createdAt: new Date(),
    deletedAt: null,
  });

  const res = await PATCH_FORM(`/items/${insertedId}`, new FormData(), {
    headers: {
      Cookie: `access_token=${me.jwt}`,
    },
  });
  const body = await res.json();

  expect(res.status).toEqual(422);
  expect(body).toMatchObject({ error: expect.any(String) });

  await itemsCollection.deleteOne({ id: insertedId });
});
