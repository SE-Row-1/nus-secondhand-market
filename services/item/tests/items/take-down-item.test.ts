import { ItemStatus } from "@/types";
import { snakeToCamel } from "@/utils/case";
import { itemsCollection } from "@/utils/db";
import { expect, it } from "bun:test";
import { request } from "../utils";

const me = {
  id: 1,
  nickname: "test",
  avatar_url: "https://example.com/test.jpg",
};
const MY_JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmlja25hbWUiOiJ0ZXN0IiwiYXZhdGFyX3VybCI6Imh0dHBzOi8vZXhhbXBsZS5jb20vdGVzdC5qcGciLCJpYXQiOjE3MjgxOTc0OTUsIm5iZiI6MTcyODE5NzQ5NSwiZXhwIjozNDU2Mzk0OTgxfQ.IWELaGDOCNYDOei6KQxMSm4FOjCiGKXgMZqhWMLnMx8";

it("takes down an item", async () => {
  const id = crypto.randomUUID();

  await itemsCollection.insertOne({
    id,
    type: "single",
    name: "test",
    description: "test",
    price: 100,
    photoUrls: [],
    seller: snakeToCamel(me),
    status: ItemStatus.FOR_SALE,
    createdAt: new Date().toISOString(),
    deletedAt: null,
  });

  const res = await request(`/${id}`, {
    method: "DELETE",
    headers: {
      Cookie: `access_token=${MY_JWT}`,
    },
  });

  expect(res.status).toEqual(204);

  const item = await itemsCollection.findOne({ id });
  expect(item?.deletedAt).not.toBeNull();

  await itemsCollection.deleteOne({ id });
});

it("returns 400 if ID is invalid", async () => {
  const res = await request(`/invalid`, {
    method: "DELETE",
    headers: {
      Cookie: `access_token=${MY_JWT}`,
    },
  });

  expect(res.status).toEqual(400);
});

it("returns 401 if user is not logged in", async () => {
  const res = await request(`/invalid`, {
    method: "DELETE",
  });

  expect(res.status).toEqual(401);
});

it("returns 403 if user is not the seller", async () => {
  const id = crypto.randomUUID();

  await itemsCollection.insertOne({
    id,
    type: "single",
    name: "test",
    description: "test",
    price: 100,
    photoUrls: [],
    seller: {
      id: 2,
      nickname: "test",
      avatarUrl: "https://example.com/test.jpg",
    },
    status: ItemStatus.FOR_SALE,
    createdAt: new Date().toISOString(),
    deletedAt: null,
  });

  const res = await request(`/${id}`, {
    method: "DELETE",
    headers: {
      Cookie: `access_token=${MY_JWT}`,
    },
  });

  expect(res.status).toEqual(403);

  await itemsCollection.deleteOne({ id });
});

it("returns 404 if item is not found", async () => {
  const id = crypto.randomUUID();

  const res = await request(`/${id}`, {
    method: "DELETE",
    headers: {
      Cookie: `access_token=${MY_JWT}`,
    },
  });

  expect(res.status).toEqual(404);
});
