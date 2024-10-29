import { ItemStatus, type Transaction } from "@/types";
import { snakeToCamel } from "@/utils/case";
import { db } from "@/utils/db";
import { afterAll, beforeAll, expect, it, mock } from "bun:test";
import { HTTPException } from "hono/http-exception";
import {
  account1,
  account2,
  jwt1,
  jwt2,
  participant1,
  participant2,
} from "../test-utils/data";
import { POST } from "../test-utils/request";

const mockAccountRequester = mock();
const mockItemRequester = mock();
const mockPublishEvent = mock();

beforeAll(() => {
  mock.module("@/utils/requester", () => ({
    createRequester: (service: string) => {
      if (service === "account") {
        return mockAccountRequester;
      }
      return mockItemRequester;
    },
  }));

  mock.module("@/events/publish", () => ({
    publishEvent: mockPublishEvent,
  }));
});

afterAll(() => {
  mock.restore();

  db.query("delete from transaction where item_name = $1", ["test-create"]);
});

it("creates a transaction", async () => {
  mockAccountRequester.mockResolvedValue({
    data: account2,
    error: null,
  });
  const itemId = crypto.randomUUID();
  mockItemRequester.mockResolvedValue({
    data: {
      id: itemId,
      name: "test-create",
      price: 100,
      seller: participant1,
      status: ItemStatus.FOR_SALE,
    },
    error: null,
  });

  const res = await POST(
    "/transactions",
    {
      item_id: itemId,
      buyer_id: participant2.id,
    },
    {
      headers: {
        Cookie: `access_token=${jwt1}`,
      },
    },
  );
  const body = snakeToCamel(await res.json()) as Transaction;

  expect(res.status).toEqual(201);
  expect(body).toEqual({
    id: expect.any(String),
    item: {
      id: itemId,
      name: "test-create",
      price: 100,
    },
    seller: participant1,
    buyer: participant2,
    createdAt: expect.any(String),
    completedAt: null,
    cancelledAt: null,
  });
  const { rowCount } = await db.query(
    "select count(*) from transaction where id = $1",
    [body.id],
  );
  expect(rowCount).toEqual(1);
  expect(mockPublishEvent).toHaveBeenCalledTimes(2);
});

it("returns 403 if user is buyer", async () => {
  const res = await POST(
    "/transactions",
    {
      item_id: crypto.randomUUID(),
      buyer_id: participant1.id,
    },
    {
      headers: {
        Cookie: `access_token=${jwt1}`,
      },
    },
  );
  const body = await res.json();

  expect(res.status).toEqual(403);
  expect(body).toEqual({ error: expect.any(String) });
});

it("returns 404 if buyer is not found", async () => {
  mockAccountRequester.mockResolvedValueOnce({
    data: null,
    error: new HTTPException(404),
  });
  const itemId = crypto.randomUUID();
  mockItemRequester.mockResolvedValue({
    data: {
      id: itemId,
      name: "test-create",
      price: 100,
      seller: participant1,
      status: ItemStatus.FOR_SALE,
    },
    error: null,
  });

  const res = await POST(
    "/transactions",
    {
      item_id: itemId,
      buyer_id: 999,
    },
    {
      headers: {
        Cookie: `access_token=${jwt1}`,
      },
    },
  );
  const body = await res.json();

  expect(res.status).toEqual(404);
  expect(body).toEqual({ error: expect.any(String) });
});

it("returns 404 if item is not found", async () => {
  mockAccountRequester.mockResolvedValue({
    data: account2,
    error: null,
  });
  mockItemRequester.mockResolvedValueOnce({
    data: null,
    error: new HTTPException(404),
  });

  const res = await POST(
    "/transactions",
    {
      item_id: crypto.randomUUID(),
      buyer_id: participant2.id,
    },
    {
      headers: {
        Cookie: `access_token=${jwt1}`,
      },
    },
  );
  const body = await res.json();

  expect(res.status).toEqual(404);
  expect(body).toEqual({ error: expect.any(String) });
});

it("returns 403 if user is not seller", async () => {
  mockAccountRequester.mockResolvedValue({
    data: account1,
    error: null,
  });
  const itemId = crypto.randomUUID();
  mockItemRequester.mockResolvedValue({
    data: {
      id: itemId,
      name: "test-create",
      price: 100,
      seller: participant1,
      status: ItemStatus.FOR_SALE,
    },
    error: null,
  });

  const res = await POST(
    "/transactions",
    {
      item_id: itemId,
      buyer_id: participant2.id,
    },
    {
      headers: {
        Cookie: `access_token=${jwt2}`,
      },
    },
  );
  const body = await res.json();

  expect(res.status).toEqual(403);
  expect(body).toEqual({ error: expect.any(String) });
});

it("returns 400 if item is not for sale", async () => {
  mockAccountRequester.mockResolvedValue({
    data: account2,
    error: null,
  });
  const itemId = crypto.randomUUID();
  mockItemRequester.mockResolvedValue({
    data: {
      id: crypto.randomUUID(),
      name: "test-create",
      price: 100,
      seller: participant1,
      status: ItemStatus.SOLD,
    },
    error: null,
  });

  const res = await POST(
    "/transactions",
    {
      item_id: itemId,
      buyer_id: participant2.id,
    },
    {
      headers: {
        Cookie: `access_token=${jwt1}`,
      },
    },
  );
  const body = await res.json();

  expect(res.status).toEqual(400);
  expect(body).toEqual({ error: expect.any(String) });
});

it("returns 409 if there is already a pending transaction", async () => {
  mockAccountRequester.mockResolvedValue({
    data: account2,
    error: null,
  });
  const itemId = crypto.randomUUID();
  mockItemRequester.mockResolvedValue({
    data: {
      id: itemId,
      name: "test-create",
      price: 100,
      seller: participant1,
      status: ItemStatus.FOR_SALE,
    },
    error: null,
  });
  await db.query(
    "insert into transaction (item_id, item_name, item_price, seller_id, seller_nickname, seller_avatar_url, buyer_id, buyer_nickname, buyer_avatar_url) values ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
    [
      itemId,
      "test-create",
      100,
      participant1.id,
      participant1.nickname,
      participant1.avatarUrl,
      participant2.id,
      participant2.nickname,
      participant2.avatarUrl,
    ],
  );

  const res = await POST(
    "/transactions",
    {
      item_id: itemId,
      buyer_id: participant2.id,
    },
    {
      headers: {
        Cookie: `access_token=${jwt1}`,
      },
    },
  );
  const body = await res.json();

  expect(res.status).toEqual(409);
  expect(body).toEqual({ error: expect.any(String) });
});
