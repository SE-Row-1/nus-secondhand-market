import * as publish from "@/events/publish";
import { ItemStatus, ItemType, type SingleItem } from "@/types";
import { snakeToCamel } from "@/utils/case";
import { itemsCollection } from "@/utils/db";
import {
  afterAll,
  afterEach,
  beforeAll,
  expect,
  it,
  mock,
  spyOn,
} from "bun:test";
import { existsSync } from "fs";
import { mkdir, rm } from "fs/promises";
import { jwt1, seller1, seller2 } from "../test-utils/data";
import { FORM } from "../test-utils/request";

beforeAll(async () => {
  if (!existsSync("uploads")) {
    await mkdir("uploads");
  }
});

const mockPublishEvent = spyOn(publish, "publishEvent");

afterEach(() => {
  mockPublishEvent.mockClear();
});

afterAll(() => {
  mock.restore();
});

it("updates an item", async () => {
  await Bun.write("uploads/test.png", "");

  const insertedId = crypto.randomUUID();

  await itemsCollection.insertOne({
    id: insertedId,
    type: ItemType.Single,
    name: "test",
    description: "test",
    price: 100,
    photoUrls: ["uploads/test.png"],
    seller: seller1,
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

  const res = await FORM(`/items/${insertedId}`, formData, {
    method: "PATCH",
    headers: {
      Cookie: `access_token=${jwt1}`,
    },
  });
  const body = snakeToCamel(await res.json()) as SingleItem;

  expect(res.status).toEqual(200);
  expect(body).toEqual(
    expect.objectContaining({
      id: insertedId,
      type: ItemType.Single,
      name: "update",
      description: "update",
      price: 200,
      photoUrls: [expect.stringMatching(/^uploads\/.+\.png$/)],
      seller: seller1,
      status: ItemStatus.ForSale,
      createdAt: expect.any(String),
      deletedAt: null,
    }),
  );
  expect(body).not.toContainKey("_id");
  expect(existsSync("uploads/test.png")).toBeFalse();
  expect(existsSync(body.photoUrls?.[0] ?? "")).toBeTrue();
  expect(
    await itemsCollection.countDocuments({ id: insertedId, name: "update" }),
  ).toEqual(1);
  expect(mockPublishEvent).toHaveBeenCalledTimes(1);

  await rm("uploads", { recursive: true });
  await itemsCollection.deleteOne({ id: insertedId });
});

it("returns 400 if the item ID is invalid", async () => {
  const res = await FORM("/items/foo", new FormData(), {
    method: "PATCH",
    headers: {
      Cookie: `access_token=${jwt1}`,
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

  const res = await FORM(
    "/items/00000000-0000-0000-0000-000000000000",
    formData,
    {
      method: "PATCH",
      headers: {
        Cookie: `access_token=${jwt1}`,
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
    seller: seller1,
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

  const res = await FORM(`/items/${insertedId}`, formData, {
    method: "PATCH",
    headers: {
      Cookie: `access_token=${jwt1}`,
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
    seller: seller1,
    status: ItemStatus.ForSale,
    createdAt: new Date(),
    deletedAt: null,
  });

  const formData = new FormData();
  formData.append("removed_photo_urls", "uploads/2.png");

  const res = await FORM(`/items/${insertedId}`, formData, {
    method: "PATCH",
    headers: {
      Cookie: `access_token=${jwt1}`,
    },
  });
  const body = await res.json();

  expect(res.status).toEqual(400);
  expect(body).toMatchObject({ error: expect.any(String) });

  await itemsCollection.deleteOne({ id: insertedId });
});

it("returns 401 if the user is not authenticated", async () => {
  const res = await FORM(
    "/items/00000000-0000-0000-0000-000000000000",
    new FormData(),
    { method: "PATCH" },
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
    seller: seller2,
    status: ItemStatus.ForSale,
    createdAt: new Date(),
    deletedAt: null,
  });

  const res = await FORM(`/items/${insertedId}`, new FormData(), {
    method: "PATCH",
    headers: {
      Cookie: `access_token=${jwt1}`,
    },
  });
  const body = await res.json();

  expect(res.status).toEqual(403);
  expect(body).toMatchObject({ error: expect.any(String) });

  await itemsCollection.deleteOne({ id: insertedId });
});

it("returns 404 if the item does not exist", async () => {
  const res = await FORM(
    "/items/00000000-0000-0000-0000-000000000000",
    new FormData(),
    {
      method: "PATCH",
      headers: {
        Cookie: `access_token=${jwt1}`,
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
    seller: seller1,
    price: 0,
    discount: 0,
    children: [],
    status: ItemStatus.ForSale,
    createdAt: new Date(),
    deletedAt: null,
  });

  const res = await FORM(`/items/${insertedId}`, new FormData(), {
    method: "PATCH",
    headers: {
      Cookie: `access_token=${jwt1}`,
    },
  });
  const body = await res.json();

  expect(res.status).toEqual(422);
  expect(body).toMatchObject({ error: expect.any(String) });

  await itemsCollection.deleteOne({ id: insertedId });
});
