import type { Item } from "@/types";
import { snakeToCamel } from "@/utils/case";
import { itemsCollection } from "@/utils/db";
import { expect, it } from "bun:test";
import { GET } from "../test-utils/request";

type PaginatedResults = {
  items: Item[];
  nextCursor: string | null;
  nextThreshold: number;
};

it("returns search results", async () => {
  const res = await GET("/items/search?q=smart&limit=3");
  const body = snakeToCamel(await res.json()) as PaginatedResults;

  expect(res.status).toEqual(200);
  expect(body).toEqual({
    items: expect.arrayContaining([
      expect.objectContaining({
        id: expect.any(String),
        type: expect.any(String),
        seller: {
          id: expect.any(Number),
          nickname: expect.any(String),
          avatarUrl: expect.any(String),
        },
        name: expect.any(String),
        description: expect.any(String),
        price: expect.any(Number),
        status: expect.any(Number),
        createdAt: expect.any(String),
        deletedAt: null,
      }),
    ]),
    nextCursor: expect.stringMatching(/^[0-9a-z]{24}$/),
    nextThreshold: expect.any(Number),
  });

  for (const item of body.items) {
    expect((item.name + item.description).toLowerCase()).toContain("smart");
  }
});

it("supports cursor-based pagination", async () => {
  const totalCount = await itemsCollection.countDocuments({
    $text: { $search: "smart" },
  });
  const limit = Math.ceil((totalCount + 1) / 2);

  const res1 = await GET(`/items/search?q=smart&limit=${limit}`);
  const body1 = snakeToCamel(await res1.json()) as PaginatedResults;

  expect(res1.status).toEqual(200);
  expect(body1.items).toBeArrayOfSize(limit);
  expect(body1.nextCursor).toMatch(/^[0-9a-z]{24}$/);
  expect(body1.nextThreshold).toBeGreaterThan(0);

  const res2 = await GET(
    `/items/search?q=smart&limit=${limit}&cursor=${body1.nextCursor}&threshold=${body1.nextThreshold}`,
  );
  const body2 = snakeToCamel(await res2.json()) as PaginatedResults;

  expect(res2.status).toEqual(200);
  expect(body2.items).toBeArrayOfSize(totalCount - limit);
  expect(body2.nextCursor).toBeNull();
  expect(body2.nextThreshold).toEqual(0);

  const idSet1 = new Set(body1.items.map((item) => item.id));
  const idSet2 = new Set(body2.items.map((item) => item.id));
  expect(idSet1.intersection(idSet2)).toBeEmpty();
  expect(idSet1.union(idSet2)).toHaveLength(totalCount);
});
