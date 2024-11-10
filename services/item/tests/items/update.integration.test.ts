import * as publish from "@/events/publish";
import { ItemStatus, ItemType, type Item, type SingleItem } from "@/types";
import { snakeToCamel } from "@/utils/case";
import { itemsCollection } from "@/utils/db";
import { afterAll, afterEach, expect, it, mock, spyOn } from "bun:test";
import { existsSync } from "fs";
import { jwt1, jwt2, seller1 } from "../test-utils/data";
import { FORM } from "../test-utils/request";

const mockPublishEvent = spyOn(publish, "publishEvent");

afterEach(() => {
  mockPublishEvent.mockClear();
});

afterAll(async () => {
  mock.restore();
  await itemsCollection.deleteMany({ name: "test" });
});

it("updates item", async () => {
  const item: Item = {
    id: crypto.randomUUID(),
    type: ItemType.Single,
    seller: seller1,
    name: "test",
    description: "test",
    price: 100,
    photoUrls: ["uploads/test1.png"],
    status: ItemStatus.ForSale,
    createdAt: new Date(),
    deletedAt: null,
  };
  await itemsCollection.insertOne({ ...item });
  await Bun.write("uploads/test1.png", "");

  const formData = new FormData();
  formData.append("price", "200");
  formData.append(
    "added_photos",
    new File(["test"], "test2.png", { type: "image/png" }),
    "test2.png",
  );
  formData.append("removed_photo_urls", "uploads/test1.png");

  const res = await FORM(`/items/${item.id}`, formData, {
    method: "PATCH",
    headers: {
      Cookie: `access_token=${jwt1}`,
    },
  });
  const body = snakeToCamel(await res.json()) as SingleItem;

  expect(res.status).toEqual(200);
  expect(body).toEqual({
    ...item,
    price: 200,
    photoUrls: [expect.stringMatching(/^uploads\/.+\.png$/)],
    createdAt: expect.any(String),
  });
  expect(existsSync("uploads/test1.png")).toBeFalse();
  expect(existsSync(body.photoUrls[0]!)).toBeTrue();
  expect(
    await itemsCollection.countDocuments({ id: item.id, price: 200 }),
  ).toEqual(1);
  expect(mockPublishEvent).toHaveBeenLastCalledWith("item", "item.updated", {
    ...body,
    createdAt: new Date(body.createdAt),
  });
});

it("returns 401 if not logged in", async () => {
  const res = await FORM(`/items/${crypto.randomUUID()}`, new FormData(), {
    method: "PATCH",
  });
  const body = await res.json();

  expect(res.status).toEqual(401);
  expect(body).toEqual({ error: expect.any(String) });
});

it("returns 404 if item is not found", async () => {
  const res = await FORM(`/items/${crypto.randomUUID()}`, new FormData(), {
    method: "PATCH",
    headers: {
      Cookie: `access_token=${jwt1}`,
    },
  });
  const body = await res.json();

  expect(res.status).toEqual(404);
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

  const res = await FORM(`/items/${id}`, new FormData(), {
    method: "PATCH",
    headers: {
      Cookie: `access_token=${jwt2}`,
    },
  });
  const body = await res.json();

  expect(res.status).toEqual(403);
  expect(body).toEqual({ error: expect.any(String) });
});

it("returns 422 if item type is not single", async () => {
  const id = crypto.randomUUID();
  await itemsCollection.insertOne({
    id,
    type: ItemType.Pack,
    seller: seller1,
    name: "test",
    description: "test",
    price: 0,
    discount: 0,
    children: [],
    status: ItemStatus.ForSale,
    createdAt: new Date(),
    deletedAt: null,
  });

  const res = await FORM(`/items/${id}`, new FormData(), {
    method: "PATCH",
    headers: {
      Cookie: `access_token=${jwt1}`,
    },
  });
  const body = await res.json();

  expect(res.status).toEqual(422);
  expect(body).toEqual({ error: expect.any(String) });
});

it("returns 400 if photo number exceed the limit", async () => {
  const id = crypto.randomUUID();
  await itemsCollection.insertOne({
    id,
    type: ItemType.Single,
    seller: seller1,
    name: "test",
    description: "test",
    price: 100,
    photoUrls: [
      "uploads/test1.png",
      "uploads/test2.png",
      "uploads/test3.png",
      "uploads/test4.png",
      "uploads/test5.png",
    ],
    status: ItemStatus.ForSale,
    createdAt: new Date(),
    deletedAt: null,
  });
  const formData = new FormData();
  formData.append(
    "added_photos",
    new File(["test"], `test6.png`, { type: "image/png" }),
    `test6.png`,
  );

  const res = await FORM(`/items/${id}`, formData, {
    method: "PATCH",
    headers: {
      Cookie: `access_token=${jwt1}`,
    },
  });
  const body = await res.json();

  expect(res.status).toEqual(400);
  expect(body).toEqual({ error: expect.any(String) });
});

it("returns 400 if the removed photo URL does not exist", async () => {
  const id = crypto.randomUUID();
  await itemsCollection.insertOne({
    id,
    type: ItemType.Single,
    seller: seller1,
    name: "test",
    description: "test",
    price: 100,
    photoUrls: ["uploads/test1.png"],
    status: ItemStatus.ForSale,
    createdAt: new Date(),
    deletedAt: null,
  });

  const formData = new FormData();
  formData.append("removed_photo_urls", "uploads/test2.png");

  const res = await FORM(`/items/${id}`, formData, {
    method: "PATCH",
    headers: {
      Cookie: `access_token=${jwt1}`,
    },
  });
  const body = await res.json();

  expect(res.status).toEqual(400);
  expect(body).toEqual({ error: expect.any(String) });
});
