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

it("returns search results", async () => {
  const res = await GET("/search?q=smart&limit=3");
  const body = (await res.json()) as ExpectedResponse;

  expect(res.status).toEqual(200);
  expect(body.items).toBeArrayOfSize(3);
  expect(body.next_cursor).toMatch(/^[0-9a-z]{24}$/);
  expect(body.next_threshold).toBeGreaterThan(0);

  for (const item of body.items) {
    expect((item.name + item.description).toLowerCase()).toContain("smart");
  }
});

it("limits the number of results", async () => {
  const res1 = await GET("/search?q=smart&limit=1");
  const body1 = (await res1.json()) as ExpectedResponse;

  expect(res1.status).toEqual(200);
  expect(body1.items).toBeArrayOfSize(1);
  expect(body1.next_cursor).toMatch(/^[0-9a-z]{24}$/);
  expect(body1.next_threshold).toBeGreaterThan(0);
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
  expect(body1.next_cursor).toMatch(/^[0-9a-z]{24}$/);
  expect(body1.next_threshold).toBeGreaterThan(0);

  const res2 = await GET(
    `/search?q=smart&limit=${limit}&cursor=${body1.next_cursor}&threshold=${body1.next_threshold}`,
  );
  const body2 = (await res2.json()) as ExpectedResponse;

  expect(res2.status).toEqual(200);
  expect(body2.items).toBeArrayOfSize(totalCount - limit);
  expect(body2.next_cursor).toBeNull();
  expect(body2.next_threshold).toEqual(0);

  const idSet1 = new Set(body1.items.map((item) => item.id));
  const idSet2 = new Set(body2.items.map((item) => item.id));
  expect(idSet1.intersection(idSet2)).toBeEmpty();
  expect(idSet1.union(idSet2)).toHaveLength(totalCount);
});

it("returns 400 if query does not exist", async () => {
  const res = await GET("/search");
  const body = await res.json();

  expect(res.status).toEqual(400);
  expect(body).toMatchObject({ error: expect.any(String) });
});

it("returns 400 if query is less than 1 character long", async () => {
  const res = await GET("/search?q=");
  const body = await res.json();

  expect(res.status).toEqual(400);
  expect(body).toMatchObject({ error: expect.any(String) });
});

it("returns 400 if query is more than 100 characters long", async () => {
  const res = await GET(`/search?q=${"a".repeat(101)}`);
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

it("returns 400 if limit is less than 1", async () => {
  const res = await GET("/search?q=smart&limit=0");
  const body = await res.json();

  expect(res.status).toEqual(400);
  expect(body).toMatchObject({ error: expect.any(String) });
});

it("returns 400 if limit is greater than 100", async () => {
  const res = await GET("/search?q=smart&limit=101");
  const body = await res.json();

  expect(res.status).toEqual(400);
  expect(body).toMatchObject({ error: expect.any(String) });
});

it("returns 400 if cursor is invalid", async () => {
  const res = await GET("/search?q=smart&cursor=foo");
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

it("returns 400 if threshold is less than 0", async () => {
  const res = await GET("/search?q=smart&threshold=-1");
  const body = await res.json();

  expect(res.status).toEqual(400);
  expect(body).toMatchObject({ error: expect.any(String) });
});
