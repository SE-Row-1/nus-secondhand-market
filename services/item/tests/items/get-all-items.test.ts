import { ItemStatus, type Item } from "@/types";
import type { CamelToSnake } from "@/utils/case";
import { itemsCollection } from "@/utils/db";
import { describe, expect, it } from "bun:test";
import { me } from "../test-utils/mock-data";
import { GET } from "../test-utils/request";

type ExpectedResponse = CamelToSnake<{
  items: Item[];
  count: number;
  nextCursor: string | null;
}>;

describe("Default behavior", () => {
  it("returns a list of items", async () => {
    const res = await GET("/");
    const body = (await res.json()) as ExpectedResponse;

    expect(res.status).toEqual(200);
    expect(body.items).toBeArray();
    expect(body.count).toBeNumber();
  });
});

describe("Given limit", () => {
  it("returns only the given amount of items", async () => {
    const res = await GET("/?limit=1");
    const body = (await res.json()) as ExpectedResponse;

    expect(res.status).toEqual(200);
    expect(body.items).toBeArrayOfSize(1);
    expect(body.count).toBeGreaterThan(1);
  });

  it("returns 400 when limit is not a number", async () => {
    const res = await GET("/?limit=foo");
    const body = await res.json();

    expect(res.status).toEqual(400);
    expect(body).toMatchObject({ error: expect.any(String) });
  });

  it("returns 400 when limit is not an integer", async () => {
    const res = await GET("/?limit=1.5");
    const body = await res.json();

    expect(res.status).toEqual(400);
    expect(body).toMatchObject({ error: expect.any(String) });
  });

  it("returns 400 when limit is not positive", async () => {
    const res = await GET("/?limit=0");
    const body = await res.json();

    expect(res.status).toEqual(400);
    expect(body).toMatchObject({ error: expect.any(String) });
  });
});

describe("Given cursor", () => {
  it("skips every item before the given cursor", async () => {
    const res1 = await GET("/?limit=1");
    const body1 = (await res1.json()) as ExpectedResponse;

    expect(res1.status).toEqual(200);
    expect(body1.items).toBeArrayOfSize(1);
    expect(body1.next_cursor).toBeString();

    const res2 = await GET(`/?limit=1&cursor=${body1.next_cursor}`);
    const body2 = (await res2.json()) as ExpectedResponse;

    expect(res2.status).toEqual(200);
    expect(body2.items).toBeArrayOfSize(1);

    expect(new Date(body2.items[0]!.created_at).getTime()).toBeLessThan(
      new Date(body1.items[0]!.created_at).getTime(),
    );
  });

  it("returns null cursor when coming to the end", async () => {
    const res = await GET("/?limit=100");
    const body = (await res.json()) as ExpectedResponse;

    expect(res.status).toEqual(200);
    expect(body.next_cursor).toBeNull();
  });
});

describe("Given type", () => {
  it("filters out single items when type is single", async () => {
    const res = await GET("/?type=single");
    const body = (await res.json()) as ExpectedResponse;

    expect(res.status).toEqual(200);

    for (const item of body.items) {
      expect(item.type).toEqual("single");
    }
  });

  it("filters out item packs when type is pack", async () => {
    const res = await GET("/?type=pack");
    const body = (await res.json()) as ExpectedResponse;

    expect(res.status).toEqual(200);

    for (const item of body.items) {
      expect(item.type).toEqual("pack");
    }
  });

  it("returns 400 when type is invalid", async () => {
    const res = await GET("/?type=foo");
    const body = await res.json();

    expect(res.status).toEqual(400);
    expect(body).toMatchObject({ error: expect.any(String) });
  });
});

describe("Given status", () => {
  it("filters out items of the given status", async () => {
    const res = await GET("/?status=1");
    const body = (await res.json()) as ExpectedResponse;

    expect(res.status).toEqual(200);

    for (const item of body.items) {
      expect(item.status).toEqual(ItemStatus.DEALT);
    }
  });

  it("returns 400 when status is not a valid status", async () => {
    const res = await GET("/?status=100");
    const body = await res.json();

    expect(res.status).toEqual(400);
    expect(body).toMatchObject({ error: expect.any(String) });
  });

  it("returns 400 when status is not a number", async () => {
    const res = await GET("/?status=foo");
    const body = await res.json();

    expect(res.status).toEqual(400);
    expect(body).toMatchObject({ error: expect.any(String) });
  });
});

describe("Given seller_id", () => {
  it("filters out items from the given seller", async () => {
    const res = await GET("/?seller_id=1");
    const body = (await res.json()) as ExpectedResponse;

    expect(res.status).toEqual(200);

    for (const item of body.items) {
      expect(item.seller.id).toEqual(1);
    }
  });

  it("returns 400 when seller_id is not a number", async () => {
    const res = await GET("/?seller_id=foo");
    const body = await res.json();

    expect(res.status).toEqual(400);
    expect(body).toMatchObject({ error: expect.any(String) });
  });

  it("returns 400 when seller_id is not an integer", async () => {
    const res = await GET("/?seller_id=1.5");
    const body = await res.json();

    expect(res.status).toEqual(400);
    expect(body).toMatchObject({ error: expect.any(String) });
  });

  it("returns 400 when seller_id is not positive", async () => {
    const res = await GET("/?seller_id=0");
    const body = await res.json();

    expect(res.status).toEqual(400);
    expect(body).toMatchObject({ error: expect.any(String) });
  });
});

describe("Ignores deleted items", () => {
  it("ignores deleted items", async () => {
    await itemsCollection.insertOne({
      id: crypto.randomUUID(),
      type: "single" as const,
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
      deletedAt: new Date(),
    });

    const res = await GET("/?limit=1000");
    const body = (await res.json()) as ExpectedResponse;

    expect(res.status).toEqual(200);
    expect(body.items).not.toContainEqual(
      expect.objectContaining({ name: "test" }),
    );

    await itemsCollection.deleteOne({ name: "test" });
  });
});
