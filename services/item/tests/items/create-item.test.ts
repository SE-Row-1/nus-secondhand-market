import { ItemStatus, type Item } from "@/types";
import { itemsCollection } from "@/utils/db";
import { expect, it } from "bun:test";
import { request } from "../utils";

type ExpectedResponse = Item;

const me = {
  id: 1,
  nickname: "test",
  avatar_url: "https://example.com/test.jpg",
};
const MY_JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmlja25hbWUiOiJ0ZXN0IiwiYXZhdGFyX3VybCI6Imh0dHBzOi8vZXhhbXBsZS5jb20vdGVzdC5qcGciLCJpYXQiOjE3MjgxOTc0OTUsIm5iZiI6MTcyODE5NzQ5NSwiZXhwIjozNDU2Mzk0OTgxfQ.IWELaGDOCNYDOei6KQxMSm4FOjCiGKXgMZqhWMLnMx8";

it("creates a new item", async () => {
  // Without photo.

  const formData = new FormData();
  formData.append("name", "test create");
  formData.append("description", "test create");
  formData.append("price", "100");

  const res1 = await request(
    "/",
    {
      method: "POST",
      body: formData,
      headers: {
        Cookie: `access_token=${MY_JWT}`,
      },
    },
    "form",
  );
  const body1 = (await res1.json()) as ExpectedResponse;

  expect(res1.status).toEqual(201);
  expect(body1).toMatchObject({
    id: expect.any(String),
    type: "single",
    seller: me,
    name: "test create",
    description: "test create",
    price: 100,
    photo_urls: [],
    status: ItemStatus.FOR_SALE,
    created_at: expect.any(String),
    deleted_at: null,
  });

  const currentCount1 = await itemsCollection.countDocuments({
    name: "test create",
  });
  expect(currentCount1).toEqual(1);

  // With exactly one photo.

  formData.append(
    "photos",
    new File(["foo"], "test1.png", { type: "image/png" }),
    "test1.png",
  );

  const res2 = await request(
    "/",
    {
      method: "POST",
      body: formData,
      headers: {
        Cookie: `access_token=${MY_JWT}`,
      },
    },
    "form",
  );
  const body2 = (await res2.json()) as ExpectedResponse;

  expect(res2.status).toEqual(201);
  expect(body2).toMatchObject({
    id: expect.any(String),
    type: "single",
    seller: me,
    name: "test create",
    description: "test create",
    price: 100,
    photo_urls: ["uploads/test1.png"],
    status: ItemStatus.FOR_SALE,
    created_at: expect.any(String),
    deleted_at: null,
  });

  const currentCount2 = await itemsCollection.countDocuments({
    name: "test create",
  });
  expect(currentCount2).toEqual(2);

  // With multiple photos.

  formData.append(
    "photos",
    new File(["foo"], "test2.jpg", { type: "image/jpeg" }),
    "test2.jpg",
  );

  const res3 = await request(
    "/",
    {
      method: "POST",
      body: formData,
      headers: {
        Cookie: `access_token=${MY_JWT}`,
      },
    },
    "form",
  );
  const body3 = (await res3.json()) as ExpectedResponse;

  expect(res3.status).toEqual(201);
  expect(body3).toMatchObject({
    id: expect.any(String),
    type: "single",
    seller: me,
    name: "test create",
    description: "test create",
    price: 100,
    photo_urls: ["uploads/test1.png", "uploads/test2.jpg"],
    status: ItemStatus.FOR_SALE,
    created_at: expect.any(String),
    deleted_at: null,
  });

  const currentCount3 = await itemsCollection.countDocuments({
    name: "test create",
  });
  expect(currentCount3).toEqual(3);

  await itemsCollection.deleteMany({ name: "test create" });
});

it("returns 400 when the MIME type is wrong", async () => {
  const formData = new FormData();
  formData.append("name", "Test item name");
  formData.append("description", "Test item description");
  formData.append("price", "100");
  formData.append(
    "photos",
    new File(["foo"], "test1.txt", { type: "text/plain" }),
    "test1.txt",
  );

  const res = await request(
    "/",
    {
      method: "POST",
      body: formData,
      headers: {
        Cookie: `access_token=${MY_JWT}`,
      },
    },
    "form",
  );

  expect(res.status).toEqual(400);
});

it("returns 400 when the file size is too large", async () => {
  const formData = new FormData();
  formData.append("name", "Test item name");
  formData.append("description", "Test item description");
  formData.append("price", "100");
  formData.append(
    "photos",
    new File(["1".repeat(6 * 1024 * 1024)], "test1.png", { type: "image/png" }),
    "test1.png",
  );

  const res = await request(
    "/",
    {
      method: "POST",
      body: formData,
      headers: {
        Cookie: `access_token=${MY_JWT}`,
      },
    },
    "form",
  );

  expect(res.status).toEqual(400);
});

it("returns 400 when the request body is invalid", async () => {
  const formData = new FormData();
  formData.append("name", "");
  formData.append("description", "");
  formData.append("price", "-1");

  const res = await request(
    "/",
    {
      method: "POST",
      body: formData,
      headers: {
        Cookie: `access_token=${MY_JWT}`,
      },
    },
    "form",
  );

  expect(res.status).toEqual(400);
});

it("returns 401 when the user is not authenticated", async () => {
  const formData = new FormData();
  formData.append("name", "Test item name");
  formData.append("description", "Test item description");
  formData.append("price", "100");
  formData.append(
    "photos",
    new File(["foo"], "test1.png", { type: "image/png" }),
    "test1.png",
  );

  const res = await request(
    "/",
    {
      method: "POST",
      body: formData,
    },
    "form",
  );

  expect(res.status).toEqual(401);
});

it("returns 401 when the JWT is invalid", async () => {
  const formData = new FormData();
  formData.append("name", "Test item name");
  formData.append("description", "Test item description");
  formData.append("price", "100");
  formData.append(
    "photos",
    new File(["foo"], "test1.png", { type: "image/png" }),
    "test1.png",
  );

  const res = await request(
    "/",
    {
      method: "POST",
      body: formData,
      headers: {
        Cookie: "access_token=invalid",
      },
    },
    "form",
  );

  expect(res.status).toEqual(401);
});
