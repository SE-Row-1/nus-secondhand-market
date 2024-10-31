import { ItemStatus, ItemType, type Item } from "@/types";
import type { CamelToSnake } from "@/utils/case";
import { itemsCollection } from "@/utils/db";
import { describe, expect, it } from "bun:test";
import { seller1 } from "../test-utils/data";
import { GET } from "../test-utils/request";

type ExpectedResponse = CamelToSnake<{
  items: Item[];
  nextCursor: string | null;
}>;

describe("Default behavior", () => {
  it("returns a list of items", async () => {
    const res = await GET("/items");
    const body = (await res.json()) as ExpectedResponse;

    expect(res.status).toEqual(200);
    expect(body.items).toBeArrayOfSize(10);
    expect(body.items[0]).not.toContainKey("_id");
    expect(body.next_cursor).toMatch(/^[0-9a-z]{24}$/);
  });

  it("ignores deleted items", async () => {
    const deletedId = crypto.randomUUID();

    await itemsCollection.insertOne({
      id: deletedId,
      type: ItemType.Single,
      name: "test",
      description: "test",
      price: 100,
      photoUrls: [],
      seller: seller1,
      status: ItemStatus.ForSale,
      createdAt: new Date(),
      deletedAt: new Date(),
    });

    const res = await GET("/items?limit=100");
    const body = (await res.json()) as ExpectedResponse;

    expect(res.status).toEqual(200);
    expect(body.items).not.toContainEqual(
      expect.objectContaining({ id: deletedId }),
    );

    await itemsCollection.deleteOne({ id: deletedId });
  });
});

describe("Given type", () => {
  it("filters items by type", async () => {
    const res1 = await GET("/items?type=single");
    const body1 = (await res1.json()) as ExpectedResponse;

    expect(res1.status).toEqual(200);

    for (const item of body1.items) {
      expect(item.type).toEqual(ItemType.Single);
    }

    const res2 = await GET("/items?type=pack");
    const body2 = (await res2.json()) as ExpectedResponse;

    expect(res2.status).toEqual(200);

    for (const item of body2.items) {
      expect(item.type).toEqual(ItemType.Pack);
    }
  });

  it("returns 400 if type is invalid", async () => {
    const res = await GET("/items?type=foo");
    const body = await res.json();

    expect(res.status).toEqual(400);
    expect(body).toMatchObject({ error: expect.any(String) });
  });
});

describe("Given status", () => {
  it("filters items by status", async () => {
    const res1 = await GET("/items?status=0");
    const body1 = (await res1.json()) as ExpectedResponse;

    expect(res1.status).toEqual(200);

    for (const item of body1.items) {
      expect(item.status).toEqual(ItemStatus.ForSale);
    }

    const res2 = await GET("/items?status=1");
    const body2 = (await res2.json()) as ExpectedResponse;

    expect(res2.status).toEqual(200);

    for (const item of body2.items) {
      expect(item.status).toEqual(ItemStatus.Dealt);
    }

    const res3 = await GET("/items?status=2");
    const body3 = (await res3.json()) as ExpectedResponse;

    expect(res3.status).toEqual(200);

    for (const item of body3.items) {
      expect(item.status).toEqual(ItemStatus.Sold);
    }
  });

  it("returns 400 if status is invalid", async () => {
    const res = await GET("/items?status=100");
    const body = await res.json();

    expect(res.status).toEqual(400);
    expect(body).toMatchObject({ error: expect.any(String) });
  });
});

describe("Given seller ID", () => {
  it("filters items by seller", async () => {
    const res = await GET("/items?seller_id=1");
    const body = (await res.json()) as ExpectedResponse;

    expect(res.status).toEqual(200);

    for (const item of body.items) {
      expect(item.seller.id).toEqual(1);
    }
  });

  it("returns 400 if seller ID is not an integer", async () => {
    const res = await GET("/items?seller_id=1.5");
    const body = await res.json();

    expect(res.status).toEqual(400);
    expect(body).toMatchObject({ error: expect.any(String) });
  });

  it("returns 400 if seller ID is less than 1", async () => {
    const res = await GET("/items?seller_id=0");
    const body = await res.json();

    expect(res.status).toEqual(400);
    expect(body).toMatchObject({ error: expect.any(String) });
  });
});

describe("Given limit", () => {
  it("limits the amount of items", async () => {
    const res = await GET("/items?limit=1");
    const body = (await res.json()) as ExpectedResponse;

    expect(res.status).toEqual(200);
    expect(body.items).toBeArrayOfSize(1);
    expect(body.next_cursor).toMatch(/^[0-9a-z]{24}$/);
  });

  it("returns 400 if limit is not an integer", async () => {
    const res = await GET("/items?limit=1.5");
    const body = await res.json();

    expect(res.status).toEqual(400);
    expect(body).toMatchObject({ error: expect.any(String) });
  });

  it("returns 400 if limit is less than 1", async () => {
    const res = await GET("/items?limit=0");
    const body = await res.json();

    expect(res.status).toEqual(400);
    expect(body).toMatchObject({ error: expect.any(String) });
  });

  it("returns 400 if limit is greater than 100", async () => {
    const res = await GET("/items?limit=101");
    const body = await res.json();

    expect(res.status).toEqual(400);
    expect(body).toMatchObject({ error: expect.any(String) });
  });
});

describe("Given cursor", () => {
  it("skips items before the cursor", async () => {
    const res1 = await GET("/items?limit=1");
    const body1 = (await res1.json()) as ExpectedResponse;

    expect(res1.status).toEqual(200);
    expect(body1.items).toBeArrayOfSize(1);
    expect(body1.next_cursor).toMatch(/^[0-9a-z]{24}$/);

    const res2 = await GET(`/items?limit=1&cursor=${body1.next_cursor}`);
    const body2 = (await res2.json()) as ExpectedResponse;

    expect(res2.status).toEqual(200);
    expect(body2.items).toBeArrayOfSize(1);
    expect(body2.next_cursor).toMatch(/^[0-9a-z]{24}$/);

    const res3 = await GET("/items?limit=2");
    const body3 = (await res3.json()) as ExpectedResponse;

    expect(res3.status).toEqual(200);
    expect(body3.items).toBeArrayOfSize(2);
    expect(body3.next_cursor).toMatch(/^[0-9a-z]{24}$/);

    expect(body1.items[0]!.id).not.toEqual(body2.items[0]!.id);
    expect(body3.items.map((item) => item.id)).toContainAllValues([
      body1.items[0]!.id,
      body2.items[0]!.id,
    ]);
  });

  it("returns null cursor if coming to the end", async () => {
    const res = await GET("/items?limit=100");
    const body = (await res.json()) as ExpectedResponse;

    expect(res.status).toEqual(200);
    expect(body.next_cursor).toBeNull();
  });

  it("returns 400 if cursor is invalid", async () => {
    const res = await GET("/items?cursor=foo");
    const body = await res.json();

    expect(res.status).toEqual(400);
    expect(body).toMatchObject({ error: expect.any(String) });
  });
});
