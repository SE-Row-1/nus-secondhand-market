import { ItemStatus, type Item } from "@/types";
import { describe, expect, it } from "bun:test";
import { request } from "../utils";

type ExpectedResponse = {
  items: Item[];
  count: number;
  nextCursor: string | null;
};

describe("Default behavior", () => {
  it("returns a list of items", async () => {
    const res = await request("/");
    const body = (await res.json()) as ExpectedResponse;

    expect(res.status).toEqual(200);
    expect(body.items).toBeArray();
    expect(body.count).toBeNumber();
  });
});

describe("Given limit", () => {
  it("returns only the given amount of items", async () => {
    const res = await request("/?limit=1");
    const body = (await res.json()) as ExpectedResponse;

    expect(res.status).toEqual(200);
    expect(body.items).toBeArrayOfSize(1);
    expect(body.count).toBeGreaterThan(1);
  });

  it("returns 400 when limit is not a number", async () => {
    const res = await request("/?limit=foo");
    const body = await res.json();

    expect(res.status).toEqual(400);
    expect(body).toMatchObject({ error: expect.any(String) });
  });

  it("returns 400 when limit is not an integer", async () => {
    const res = await request("/?limit=1.5");
    const body = await res.json();

    expect(res.status).toEqual(400);
    expect(body).toMatchObject({ error: expect.any(String) });
  });

  it("returns 400 when limit is not positive", async () => {
    const res = await request("/?limit=0");
    const body = await res.json();

    expect(res.status).toEqual(400);
    expect(body).toMatchObject({ error: expect.any(String) });
  });
});

describe("Given cursor", () => {
  it("skips every item before the given cursor", async () => {
    const res1 = await request("/?limit=1");
    const body1 = (await res1.json()) as ExpectedResponse;
    const nextCursor = body1.nextCursor;

    expect(res1.status).toEqual(200);
    expect(body1.items).toBeArrayOfSize(1);
    expect(nextCursor).toBeString();

    const res2 = await request(`/?limit=1&cursor=${nextCursor}`);
    const body2 = (await res2.json()) as ExpectedResponse;

    expect(res2.status).toEqual(200);
    expect(body2.items).toBeArrayOfSize(1);

    expect(new Date(body2.items[0]!.created_at).getTime()).toBeLessThan(
      new Date(body1.items[0]!.created_at).getTime(),
    );
  });

  it("returns null cursor when coming to the end", async () => {
    const res = await request("/?limit=100");
    const body = (await res.json()) as ExpectedResponse;

    expect(res.status).toEqual(200);
    expect(body.nextCursor).toBeNull();
  });
});

describe("Given type", () => {
  it("filters out single items when type is single", async () => {
    const res = await request("/?type=single");
    const body = (await res.json()) as ExpectedResponse;

    expect(res.status).toEqual(200);

    for (const item of body.items) {
      expect(item.type).toEqual("single");
    }
  });

  it("filters out item packs when type is pack", async () => {
    const res = await request("/?type=pack");
    const body = (await res.json()) as ExpectedResponse;

    expect(res.status).toEqual(200);

    for (const item of body.items) {
      expect(item.type).toEqual("pack");
    }
  });

  it("returns 400 when type is invalid", async () => {
    const res = await request("/?type=foo");
    const body = await res.json();

    expect(res.status).toEqual(400);
    expect(body).toMatchObject({ error: expect.any(String) });
  });
});

describe("Given status", () => {
  it("filters out items of the given status", async () => {
    const res = await request("/?status=1");
    const body = (await res.json()) as ExpectedResponse;

    expect(res.status).toEqual(200);

    for (const item of body.items) {
      expect(item.status).toEqual(ItemStatus.DEALT);
    }
  });

  it("returns 400 when status is not a valid status", async () => {
    const res = await request("/?status=100");
    const body = await res.json();

    expect(res.status).toEqual(400);
    expect(body).toMatchObject({ error: expect.any(String) });
  });

  it("returns 400 when status is not a number", async () => {
    const res = await request("/?status=foo");
    const body = await res.json();

    expect(res.status).toEqual(400);
    expect(body).toMatchObject({ error: expect.any(String) });
  });
});
