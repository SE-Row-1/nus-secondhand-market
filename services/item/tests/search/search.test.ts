import type { Item } from "@/types";
import type { CamelToSnake } from "@/utils/case";
import { itemsCollection } from "@/utils/db";
import { expect, it } from "bun:test";
import { GET } from "../test-utils/request";

type ExpectedResponse = CamelToSnake<{
  items: Item[];
  nextCursor: string | null;
  nextThreshold: number;
}>;

it("returns results containing the search query", async () => {
  const res = await GET("/search?q=smart&limit=3");
  const body = (await res.json()) as ExpectedResponse;

  expect(res.status).toEqual(200);
  expect(body.items).toBeArray();
  expect(body.next_cursor).toBeString();
  expect(body.next_threshold).toBeNumber();

  for (const item of body.items) {
    expect((item.name + item.description).toLowerCase()).toContain("smart");
  }
});

it("limits the number of results", async () => {
  const res1 = await GET("/search?q=smart&limit=1");
  const body1 = (await res1.json()) as ExpectedResponse;

  expect(res1.status).toEqual(200);
  expect(body1.items).toBeArrayOfSize(1);
  expect(body1.next_cursor).toBeString();
  expect(body1.next_threshold).toBeNumber();

  const res2 = await GET(`/search?q=smart&limit=2`);
  const body2 = (await res2.json()) as ExpectedResponse;

  expect(res2.status).toEqual(200);
  expect(body2.items).toBeArrayOfSize(2);
  expect(body2.next_cursor).toBeString();
  expect(body2.next_threshold).toBeNumber();
});

it("implements cursor-based pagination", async () => {
  const totalCount = await itemsCollection.countDocuments({
    $text: { $search: "smart" },
  });
  const limit = Math.ceil((totalCount + 1) / 2);

  const res1 = await GET(`/search?q=smart&limit=${limit}`);
  const body1 = (await res1.json()) as ExpectedResponse;

  expect(res1.status).toEqual(200);
  expect(body1.items).toBeArrayOfSize(limit);
  expect(body1.next_cursor).toBeString();
  expect(body1.next_threshold).toBeNumber();

  const res2 = await GET(
    `/search?q=smart&limit=${limit}&cursor=${body1.next_cursor}&threshold=${body1.next_threshold}`,
  );
  const body2 = (await res2.json()) as ExpectedResponse;
  console.log(body2);

  expect(res2.status).toEqual(200);
  expect(body2.items).toBeArrayOfSize(totalCount - limit);
  expect(body2.next_cursor).toBeNull();
  expect(body2.next_threshold).toEqual(0);

  expect(body1.items[0]!.id).not.toEqual(body2.items[0]!.id);
});

it("returns 400 if query is not given", async () => {
  const res = await GET("/search");
  const body = await res.json();

  expect(res.status).toEqual(400);
  expect(body).toMatchObject({ error: expect.any(String) });
});

it("returns 400 if query is empty", async () => {
  const res = await GET("/search?q=");
  const body = await res.json();

  expect(res.status).toEqual(400);
  expect(body).toMatchObject({ error: expect.any(String) });
});

it("returns 400 if query is too long", async () => {
  const res = await GET(`/search?q=${"x".repeat(101)}`);
  const body = await res.json();

  expect(res.status).toEqual(400);
  expect(body).toMatchObject({ error: expect.any(String) });
});

it("returns 400 if limit is not a number", async () => {
  const res = await GET("/search?q=smart&limit=foo");
  const body = await res.json();

  expect(res.status).toEqual(400);
  expect(body).toMatchObject({ error: expect.any(String) });
});

it("returns 400 if limit is not positive", async () => {
  const res = await GET("/search?q=smart&limit=0");
  const body = await res.json();

  expect(res.status).toEqual(400);
  expect(body).toMatchObject({ error: expect.any(String) });
});

it("returns 400 if limit is not an integer", async () => {
  const res = await GET("/search?q=smart&limit=1.5");
  const body = await res.json();

  expect(res.status).toEqual(400);
  expect(body).toMatchObject({ error: expect.any(String) });
});

it("returns 400 if threshold is not a number", async () => {
  const res = await GET("/search?q=smart&threshold=foo");
  const body = await res.json();

  expect(res.status).toEqual(400);
  expect(body).toMatchObject({ error: expect.any(String) });
});
