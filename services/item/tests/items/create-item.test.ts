import { ItemStatus, type Item } from "@/types";
import { itemsCollection } from "@/utils/db";
import { expect, it } from "bun:test";
import { me, myJwt } from "../test-utils/mock-data";
import { FORM } from "../test-utils/request";

type ExpectedResponse = Item;

it("creates a new item", async () => {
  // Without photo.

  const formData = new FormData();
  formData.append("name", "test create");
  formData.append("description", "test create");
  formData.append("price", "100");

  const res1 = await FORM("/", formData, {
    headers: {
      Cookie: `access_token=${myJwt}`,
    },
  });
  const body1 = (await res1.json()) as ExpectedResponse;

  expect(res1.status).toEqual(201);
  expect(body1).toMatchObject({
    id: expect.any(String),
    type: "single",
    seller: {
      id: me.id,
      nickname: me.nickname,
      avatar_url: me.avatarUrl,
    },
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

  const res2 = await FORM("/", formData, {
    headers: {
      Cookie: `access_token=${myJwt}`,
    },
  });
  const body2 = (await res2.json()) as ExpectedResponse;

  expect(res2.status).toEqual(201);
  expect(body2).toMatchObject({
    id: expect.any(String),
    type: "single",
    seller: {
      id: me.id,
      nickname: me.nickname,
      avatar_url: me.avatarUrl,
    },
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

  const res3 = await FORM("/", formData, {
    headers: {
      Cookie: `access_token=${myJwt}`,
    },
  });
  const body3 = (await res3.json()) as ExpectedResponse;

  expect(res3.status).toEqual(201);
  expect(body3).toMatchObject({
    id: expect.any(String),
    type: "single",
    seller: {
      id: me.id,
      nickname: me.nickname,
      avatar_url: me.avatarUrl,
    },
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

  const res = await FORM("/", formData, {
    headers: {
      Cookie: `access_token=${myJwt}`,
    },
  });

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

  const res = await FORM("/", formData, {
    headers: {
      Cookie: `access_token=${myJwt}`,
    },
  });

  expect(res.status).toEqual(400);
});

it("returns 400 when the FORM body is invalid", async () => {
  const formData = new FormData();
  formData.append("name", "");
  formData.append("description", "");
  formData.append("price", "-1");

  const res = await FORM("/", formData, {
    headers: {
      Cookie: `access_token=${myJwt}`,
    },
  });

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

  const res = await FORM("/", formData);

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

  const res = await FORM("/", formData, {
    headers: {
      Cookie: "access_token=invalid",
    },
  });

  expect(res.status).toEqual(401);
});
