import * as publish from "@/events/publish";
import { ItemStatus, type Transaction } from "@/types";
import { snakeToCamel } from "@/utils/case";
import { db } from "@/utils/db";
import * as requester from "@/utils/requester";
import { afterAll, afterEach, expect, it, mock, spyOn } from "bun:test";
import { HTTPException } from "hono/http-exception";
import { account2, jwt1, participant1, participant2 } from "../test-utils/data";
import { POST } from "../test-utils/request";

const mockAccountRequester = mock();
const mockItemRequester = mock();
const mockRequester = spyOn(requester, "createRequester").mockImplementation(
  (service: string) => {
    if (service === "account") {
      return mockAccountRequester;
    }
    return mockItemRequester;
  },
);
const mockPublishEvent = spyOn(publish, "publishEvent");

afterEach(() => {
  mockAccountRequester.mockClear();
  mockItemRequester.mockClear();
  mockRequester.mockClear();
  mockPublishEvent.mockClear();
});

afterAll(async () => {
  mock.restore();
  await db.query("delete from transaction where item_name = 'test'");
});

it("creates transaction", async () => {
  const item = {
    id: crypto.randomUUID(),
    name: "test",
    price: 100,
  };
  mockAccountRequester.mockResolvedValueOnce({
    data: account2,
    error: null,
  });
  mockItemRequester.mockResolvedValueOnce({
    data: {
      ...item,
      seller: participant1,
      status: ItemStatus.FOR_SALE,
    },
    error: null,
  });

  const res = await POST(
    "/transactions",
    {
      item_id: item.id,
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
    item,
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
  expect(mockAccountRequester).toHaveBeenLastCalledWith("/accounts/2");
  expect(mockItemRequester).toHaveBeenLastCalledWith(`/items/${item.id}`);
  expect(mockPublishEvent).toHaveBeenNthCalledWith(
    1,
    "transaction",
    "transaction.created",
    { ...body, createdAt: new Date(body.createdAt) },
  );
  expect(mockPublishEvent).toHaveBeenNthCalledWith(
    2,
    "transaction",
    "transaction.auto-completed",
    { ...body, createdAt: new Date(body.createdAt) },
  );
});

it("returns 401 if not logged in", async () => {
  const res = await POST("/transactions", {
    item_id: crypto.randomUUID(),
    buyer_id: participant2.id,
  });
  const body = await res.json();

  expect(res.status).toEqual(401);
  expect(body).toEqual({ error: expect.any(String) });
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
  const item = {
    id: crypto.randomUUID(),
    name: "test",
    price: 100,
  };
  mockAccountRequester.mockResolvedValueOnce({
    data: null,
    error: new HTTPException(404),
  });
  mockItemRequester.mockResolvedValueOnce({
    data: {
      ...item,
      seller: participant1,
      status: ItemStatus.FOR_SALE,
    },
    error: null,
  });

  const res = await POST(
    "/transactions",
    {
      item_id: item.id,
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

it("returns 404 if item is not found", async () => {
  mockAccountRequester.mockResolvedValueOnce({
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
  const item = {
    id: crypto.randomUUID(),
    name: "test",
    price: 100,
  };
  mockAccountRequester.mockResolvedValueOnce({
    data: account2,
    error: null,
  });
  mockItemRequester.mockResolvedValueOnce({
    data: {
      ...item,
      seller: participant2,
      status: ItemStatus.FOR_SALE,
    },
    error: null,
  });

  const res = await POST(
    "/transactions",
    {
      item_id: item.id,
      buyer_id: participant2.id,
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

it("returns 409 if item is not for sale", async () => {
  const item = {
    id: crypto.randomUUID(),
    name: "test",
    price: 100,
  };
  mockAccountRequester.mockResolvedValueOnce({
    data: account2,
    error: null,
  });
  mockItemRequester.mockResolvedValueOnce({
    data: {
      ...item,
      seller: participant1,
      status: ItemStatus.SOLD,
    },
    error: null,
  });

  const res = await POST(
    "/transactions",
    {
      item_id: item.id,
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

it("returns 409 if there is already a pending transaction", async () => {
  const item = {
    id: crypto.randomUUID(),
    name: "test",
    price: 100,
  };
  mockAccountRequester.mockResolvedValueOnce({
    data: account2,
    error: null,
  });
  mockItemRequester.mockResolvedValueOnce({
    data: {
      ...item,
      seller: participant1,
      status: ItemStatus.FOR_SALE,
    },
    error: null,
  });
  await db.query(
    "insert into transaction (item_id, item_name, item_price, seller_id, seller_nickname, seller_avatar_url, buyer_id, buyer_nickname, buyer_avatar_url) values ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
    [
      item.id,
      item.name,
      item.price,
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
      item_id: item.id,
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
