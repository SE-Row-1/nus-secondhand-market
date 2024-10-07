import { ItemStatus } from "@/types";
import { itemsCollection } from "@/utils/db";
import { expect, it } from "bun:test";
import { request } from "../utils";

const me = {
  id: 1,
  email: "test@example.com",
  nickname: "test",
  avatarUrl: "https://example.com/test.jpg",
  phoneCode: "65",
  phoneNumber: "12345678",
  department: {
    id: 1,
    acronym: "TEST",
    name: "test department",
  },
  createdAt: new Date("2024-10-07T06:49:51.460Z"),
  deletedAt: null,
};

const MY_JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwibmlja25hbWUiOiJ0ZXN0IiwiYXZhdGFyVXJsIjoiaHR0cHM6Ly9leGFtcGxlLmNvbS90ZXN0LmpwZyIsInBob25lQ29kZSI6IjY1IiwicGhvbmVOdW1iZXIiOiIxMjM0NTY3OCIsImRlcGFydG1lbnQiOnsiaWQiOjEsImFjcm9ueW0iOiJURVNUIiwibmFtZSI6InRlc3QgZGVwYXJ0bWVudCJ9LCJjcmVhdGVkQXQiOiIyMDI0LTEwLTA3VDA2OjQ5OjUxLjQ2MFoiLCJkZWxldGVkQXQiOm51bGwsImlhdCI6MTcyODI4MzgzMiwibmJmIjoxNzI4MjgzODMyLCJleHAiOjM1NTY1NTk5OTd9.2cXAAWpEGuJnRK2bNuiUyD2tCDKZHWCi6yns2sEACWM";

it("takes down an item", async () => {
  const id = crypto.randomUUID();

  await itemsCollection.insertOne({
    id,
    type: "single",
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
    createdAt: new Date(),
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
