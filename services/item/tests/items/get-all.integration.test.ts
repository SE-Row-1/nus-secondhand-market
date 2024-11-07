import { ItemStatus, ItemType, type Item } from "@/types";
import { snakeToCamel } from "@/utils/case";
import { expect, it } from "bun:test";
import { GET } from "../test-utils/request";

type PaginatedItems = {
  items: Item[];
  nextCursor: string | null;
};

it("returns items", async () => {
  const res = await GET("/items");
  const body = snakeToCamel(await res.json());

  expect(res.status).toEqual(200);
  expect(body).toEqual({
    items: expect.arrayContaining([
      expect.objectContaining({
        id: expect.any(String),
        type: expect.any(String),
        seller: {
          id: expect.any(Number),
          nickname: expect.not.stringContaining("x"),
          avatarUrl: expect.not.stringContaining("x"),
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
  });
});

it("filters items if type is given", async () => {
  const res1 = await GET("/items?type=single");
  const body1 = snakeToCamel(await res1.json()) as PaginatedItems;

  expect(res1.status).toEqual(200);
  for (const item of body1.items) {
    expect(item.type).toEqual(ItemType.Single);
  }

  const res2 = await GET("/items?type=pack");
  const body2 = snakeToCamel(await res2.json()) as PaginatedItems;

  expect(res2.status).toEqual(200);
  for (const item of body2.items) {
    expect(item.type).toEqual(ItemType.Pack);
  }
});

it("filters items if status is given", async () => {
  const res1 = await GET("/items?status=0");
  const body1 = snakeToCamel(await res1.json()) as PaginatedItems;

  expect(res1.status).toEqual(200);
  for (const item of body1.items) {
    expect(item.status).toEqual(ItemStatus.ForSale);
  }

  const res2 = await GET("/items?status=1");
  const body2 = snakeToCamel(await res2.json()) as PaginatedItems;

  expect(res2.status).toEqual(200);
  for (const item of body2.items) {
    expect(item.status).toEqual(ItemStatus.Dealt);
  }

  const res3 = await GET("/items?status=2");
  const body3 = snakeToCamel(await res3.json()) as PaginatedItems;

  expect(res3.status).toEqual(200);
  for (const item of body3.items) {
    expect(item.status).toEqual(ItemStatus.Sold);
  }
});

it("filters items if seller_id is given", async () => {
  const res = await GET("/items?seller_id=1");
  const body = snakeToCamel(await res.json()) as PaginatedItems;

  expect(res.status).toEqual(200);
  for (const item of body.items) {
    expect(item.seller.id).toEqual(1);
  }
});

it("supports cursor-based pagination", async () => {
  const res1 = await GET("/items?limit=1");
  const body1 = snakeToCamel(await res1.json()) as PaginatedItems;

  expect(res1.status).toEqual(200);
  expect(body1.items).toBeArrayOfSize(1);
  expect(body1.nextCursor).toMatch(/^[0-9a-z]{24}$/);

  const res2 = await GET(`/items?limit=1&cursor=${body1.nextCursor}`);
  const body2 = snakeToCamel(await res2.json()) as PaginatedItems;

  expect(res2.status).toEqual(200);
  expect(body2.items).toBeArrayOfSize(1);
  expect(body2.nextCursor).toMatch(/^[0-9a-z]{24}$/);

  const res3 = await GET("/items?limit=2");
  const body3 = snakeToCamel(await res3.json()) as PaginatedItems;

  expect(res3.status).toEqual(200);
  expect(body3.items).toBeArrayOfSize(2);
  expect(body3.nextCursor).toMatch(/^[0-9a-z]{24}$/);
  expect(body3.items.map((item) => item.id)).toContainAllValues([
    body1.items[0]!.id,
    body2.items[0]!.id,
  ]);
});
