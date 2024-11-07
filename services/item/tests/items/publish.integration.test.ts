import { ItemStatus, ItemType, type Item } from "@/types";
import { snakeToCamel } from "@/utils/case";
import { itemsCollection } from "@/utils/db";
import { afterAll, expect, it } from "bun:test";
import { jwt1, seller1 } from "../test-utils/data";
import { FORM } from "../test-utils/request";

afterAll(async () => {
  await itemsCollection.deleteMany({ name: "test" });
});

it("creates item without photo", async () => {
  const formData = new FormData();
  formData.append("name", "test");
  formData.append("description", "test");
  formData.append("price", "100");

  const res = await FORM("/items", formData, {
    headers: {
      Cookie: `access_token=${jwt1}`,
    },
  });
  const body = snakeToCamel(await res.json()) as Item;

  expect(res.status).toEqual(201);
  expect(body).toEqual({
    id: expect.any(String),
    type: ItemType.Single,
    seller: seller1,
    name: "test",
    description: "test",
    price: 100,
    photoUrls: [],
    status: ItemStatus.ForSale,
    createdAt: expect.any(String),
    deletedAt: null,
  });
  expect(await itemsCollection.countDocuments({ id: body.id })).toEqual(1);
});

it("creates item with one photo", async () => {
  const formData = new FormData();
  formData.append("name", "test");
  formData.append("description", "test");
  formData.append("price", "100");
  formData.append(
    "photos",
    new File(["test"], "test1.png", { type: "image/png" }),
    "test1.png",
  );

  const res = await FORM("/items", formData, {
    headers: {
      Cookie: `access_token=${jwt1}`,
    },
  });
  const body = snakeToCamel(await res.json()) as Item;

  expect(res.status).toEqual(201);
  expect(body).toEqual({
    id: expect.any(String),
    type: ItemType.Single,
    seller: seller1,
    name: "test",
    description: "test",
    price: 100,
    photoUrls: [expect.stringMatching(/^uploads\/.+\.png$/)],
    status: ItemStatus.ForSale,
    createdAt: expect.any(String),
    deletedAt: null,
  });
  expect(await itemsCollection.countDocuments({ id: body.id })).toEqual(1);
});

it("creates item with multiple photos", async () => {
  const formData = new FormData();
  formData.append("name", "test");
  formData.append("description", "test");
  formData.append("price", "100");
  formData.append(
    "photos",
    new File(["test"], "test1.png", { type: "image/png" }),
    "test1.png",
  );
  formData.append(
    "photos",
    new File(["test"], "test2.jpg", { type: "image/jpeg" }),
    "test2.jpg",
  );

  const res = await FORM("/items", formData, {
    headers: {
      Cookie: `access_token=${jwt1}`,
    },
  });
  const body = snakeToCamel(await res.json()) as Item;

  expect(res.status).toEqual(201);
  expect(body).toEqual({
    id: expect.any(String),
    type: ItemType.Single,
    seller: seller1,
    name: "test",
    description: "test",
    price: 100,
    photoUrls: [
      expect.stringMatching(/^uploads\/.+\.png$/),
      expect.stringMatching(/^uploads\/.+\.jpg$/),
    ],
    status: ItemStatus.ForSale,
    createdAt: expect.any(String),
    deletedAt: null,
  });
  expect(await itemsCollection.countDocuments({ id: body.id })).toEqual(1);
});

it("returns 401 if not logged in", async () => {
  const formData = new FormData();
  formData.append("name", "test");
  formData.append("description", "test");
  formData.append("price", "100");

  const res = await FORM("/items", formData);
  const body = await res.json();

  expect(res.status).toEqual(401);
  expect(body).toEqual({ error: expect.any(String) });
});
