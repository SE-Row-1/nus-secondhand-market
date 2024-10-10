import { type Item } from "@/types";
import { itemsCollection } from "@/utils/db";
import { expect, it } from "bun:test";
import { myJwt } from "../test-utils/mock-data";
import { FORM } from "../test-utils/request";

type ExpectedResponse = Item;

it("creates an item without photo", async () => {
  const formData = new FormData();
  formData.append("name", "test");
  formData.append("description", "test");
  formData.append("price", "100");

  const res = await FORM("/", formData, {
    headers: {
      Cookie: `access_token=${myJwt}`,
    },
  });
  const body = (await res.json()) as ExpectedResponse;

  expect(res.status).toEqual(201);

  const count = await itemsCollection.countDocuments({ id: body.id });
  expect(count).toEqual(1);

  await itemsCollection.deleteOne({ id: body.id });
});

it("creates an item with exactly 1 photo", async () => {
  const formData = new FormData();
  formData.append("name", "test");
  formData.append("description", "test");
  formData.append("price", "100");
  formData.append(
    "photos",
    new File(["foo"], "test1.png", { type: "image/png" }),
    "test1.png",
  );

  const res = await FORM("/", formData, {
    headers: {
      Cookie: `access_token=${myJwt}`,
    },
  });
  const body = (await res.json()) as ExpectedResponse;

  expect(res.status).toEqual(201);

  const count = await itemsCollection.countDocuments({ id: body.id });
  expect(count).toEqual(1);

  await itemsCollection.deleteOne({ id: body.id });
});

it("creates an item with multiple photos", async () => {
  const formData = new FormData();
  formData.append("name", "test");
  formData.append("description", "test");
  formData.append("price", "100");
  formData.append(
    "photos",
    new File(["foo"], "test1.png", { type: "image/png" }),
    "test1.png",
  );
  formData.append(
    "photos",
    new File(["foo"], "test2.jpg", { type: "image/jpeg" }),
    "test2.jpg",
  );

  const res = await FORM("/", formData, {
    headers: {
      Cookie: `access_token=${myJwt}`,
    },
  });
  const body = (await res.json()) as ExpectedResponse;

  expect(res.status).toEqual(201);

  const count = await itemsCollection.countDocuments({ id: body.id });
  expect(count).toEqual(1);

  await itemsCollection.deleteOne({ id: body.id });
});

it("returns 400 if name is less than 1 character long", async () => {
  const formData = new FormData();
  formData.append("name", "");
  formData.append("description", "test");
  formData.append("price", "100");

  const res = await FORM("/", formData, {
    headers: {
      Cookie: `access_token=${myJwt}`,
    },
  });
  const body = await res.json();

  expect(res.status).toEqual(400);
  expect(body).toMatchObject({ error: expect.any(String) });
});

it("returns 400 if name is more than 50 characters long", async () => {
  const formData = new FormData();
  formData.append("name", "a".repeat(51));
  formData.append("description", "test");
  formData.append("price", "100");

  const res = await FORM("/", formData, {
    headers: {
      Cookie: `access_token=${myJwt}`,
    },
  });
  const body = await res.json();

  expect(res.status).toEqual(400);
  expect(body).toMatchObject({ error: expect.any(String) });
});

it("returns 400 if description is less than 1 character long", async () => {
  const formData = new FormData();
  formData.append("name", "test");
  formData.append("description", "");
  formData.append("price", "100");

  const res = await FORM("/", formData, {
    headers: {
      Cookie: `access_token=${myJwt}`,
    },
  });
  const body = await res.json();

  expect(res.status).toEqual(400);
  expect(body).toMatchObject({ error: expect.any(String) });
});

it("returns 400 if description is more than 500 characters long", async () => {
  const formData = new FormData();
  formData.append("name", "test");
  formData.append("description", "a".repeat(501));
  formData.append("price", "100");

  const res = await FORM("/", formData, {
    headers: {
      Cookie: `access_token=${myJwt}`,
    },
  });
  const body = await res.json();

  expect(res.status).toEqual(400);
  expect(body).toMatchObject({ error: expect.any(String) });
});

it("returns 400 if price is not a number", async () => {
  const formData = new FormData();
  formData.append("name", "test");
  formData.append("description", "test");
  formData.append("price", "foo");

  const res = await FORM("/", formData, {
    headers: {
      Cookie: `access_token=${myJwt}`,
    },
  });
  const body = await res.json();

  expect(res.status).toEqual(400);
  expect(body).toMatchObject({ error: expect.any(String) });
});

it("returns 400 if price is less than 0", async () => {
  const formData = new FormData();
  formData.append("name", "test");
  formData.append("description", "test");
  formData.append("price", "-1");

  const res = await FORM("/", formData, {
    headers: {
      Cookie: `access_token=${myJwt}`,
    },
  });
  const body = await res.json();

  expect(res.status).toEqual(400);
  expect(body).toMatchObject({ error: expect.any(String) });
});

it("returns 400 if photo is not file", async () => {
  const formData = new FormData();
  formData.append("name", "test");
  formData.append("description", "test");
  formData.append("price", "100");
  formData.append("photos", "foo");

  const res = await FORM("/", formData, {
    headers: {
      Cookie: `access_token=${myJwt}`,
    },
  });
  const body = await res.json();

  expect(res.status).toEqual(400);
  expect(body).toMatchObject({ error: expect.any(String) });
});

it("returns 400 if photo MIME type is unsupported", async () => {
  const formData = new FormData();
  formData.append("name", "test");
  formData.append("description", "test");
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
  const body = await res.json();

  expect(res.status).toEqual(400);
  expect(body).toMatchObject({ error: expect.any(String) });
});

it("returns 400 if photo size is too large", async () => {
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
  const body = await res.json();

  expect(res.status).toEqual(400);
  expect(body).toMatchObject({ error: expect.any(String) });
});

it("returns 401 if user is not authenticated", async () => {
  const formData = new FormData();
  formData.append("name", "test");
  formData.append("description", "test");
  formData.append("price", "100");
  formData.append(
    "photos",
    new File(["foo"], "test1.png", { type: "image/png" }),
    "test1.png",
  );

  const res = await FORM("/", formData);
  const body = await res.json();

  expect(res.status).toEqual(401);
  expect(body).toMatchObject({ error: expect.any(String) });
});

it("returns 401 if JWT is invalid", async () => {
  const formData = new FormData();
  formData.append("name", "test");
  formData.append("description", "test");
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
  const body = await res.json();

  expect(res.status).toEqual(401);
  expect(body).toMatchObject({ error: expect.any(String) });
});
