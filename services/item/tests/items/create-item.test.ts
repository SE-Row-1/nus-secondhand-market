import { expect, it } from "bun:test";
import { request } from "../utils";

// type ExpectedResponse = Item;

// const ORIGINAL_COUNT = 31;
// const me = {
//   id: 1,
//   nickname: "test",
//   avatar_url: "https://example.com/test.jpg",
// };
const MY_JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmlja25hbWUiOiJ0ZXN0IiwiYXZhdGFyX3VybCI6Imh0dHBzOi8vZXhhbXBsZS5jb20vdGVzdC5qcGciLCJpYXQiOjE3MjgxOTc0OTUsIm5iZiI6MTcyODE5NzQ5NSwiZXhwIjozNDU2Mzk0OTgxfQ.IWELaGDOCNYDOei6KQxMSm4FOjCiGKXgMZqhWMLnMx8";

// it("creates a new item", async () => {
//   const formData = new FormData();
//   formData.append("name", "Test item name");
//   formData.append("description", "Test item description");
//   formData.append("price", "100");
//   formData.append("photos", new File([], "test1.jpg", { type: "image/jpeg" }));

//   const res = await request("/", {
//     method: "POST",
//     body: formData,
//     headers: {
//       Cookie: `access_token=${MY_JWT}`,
//       "Content-Type": "multipart/form-data boundary=----abc",
//     },
//   });
//   const body = (await res.json()) as ExpectedResponse;
//   console.log(body);

//   expect(res.status).toEqual(201);
//   expect(body).toMatchObject({
//     id: expect.any(String),
//     type: "single",
//     seller: me,
//     name: "Test item name",
//     description: "Test item description",
//     price: 100,
//     photo_urls: [],
//     status: ItemStatus.FOR_SALE,
//     created_at: expect.any(String),
//     deleted_at: null,
//   });

//   const currentCount = await itemsCollection.estimatedDocumentCount();
//   expect(currentCount).toEqual(ORIGINAL_COUNT + 1);

//   await itemsCollection.deleteOne({ name: "Test item name" });
// });

it("returns 400 if the request body is invalid", async () => {
  const res = await request("/", {
    method: "POST",
    body: JSON.stringify({
      name: "",
      description: "",
      price: -1,
      photo_urls: [],
    }),
    headers: {
      Cookie: `access_token=${MY_JWT}`,
    },
  });

  expect(res.status).toEqual(400);
});

it("returns 401 if the user is not authenticated", async () => {
  const res = await request("/", {
    method: "POST",
    body: JSON.stringify({
      name: "Test item name",
      description: "Test item description",
      price: 100,
      photo_urls: [],
    }),
  });

  expect(res.status).toEqual(401);
});

it("returns 401 if the JWT is invalid", async () => {
  const res = await request("/", {
    method: "POST",
    body: JSON.stringify({
      name: "Test item name",
      description: "Test item description",
      price: 100,
      photo_urls: [],
    }),
    headers: {
      Cookie: "access_token=invalid",
    },
  });

  expect(res.status).toEqual(401);
});
