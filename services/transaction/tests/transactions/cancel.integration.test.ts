import * as publish from "@/events/publish";
import type { Transaction } from "@/types";
import { db } from "@/utils/db";
import { afterAll, afterEach, expect, it, mock, spyOn } from "bun:test";
import { jwt1, jwt2, participant1, participant2 } from "../test-utils/data";
import { POST } from "../test-utils/request";

const mockPublishEvent = spyOn(publish, "publishEvent");

afterEach(() => {
  mockPublishEvent.mockClear();
});

afterAll(async () => {
  mock.restore();
  await db.query("delete from transaction where item_name = 'test'");
});

it("cancels transaction", async () => {
  const transaction: Transaction = {
    id: crypto.randomUUID(),
    item: {
      id: crypto.randomUUID(),
      name: "test",
      price: 100,
    },
    seller: participant1,
    buyer: participant2,
    createdAt: new Date().toISOString(),
    completedAt: null,
    cancelledAt: null,
  };
  await db.query(
    "insert into transaction (id, item_id, item_name, item_price, seller_id, seller_nickname, seller_avatar_url, buyer_id, buyer_nickname, buyer_avatar_url, created_at) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)",
    [
      transaction.id,
      transaction.item.id,
      transaction.item.name,
      transaction.item.price,
      transaction.seller.id,
      transaction.seller.nickname,
      transaction.seller.avatarUrl,
      transaction.buyer.id,
      transaction.buyer.nickname,
      transaction.buyer.avatarUrl,
      transaction.createdAt,
    ],
  );

  const res = await POST(
    `/transactions/${transaction.id}/cancel`,
    {},
    {
      headers: {
        Cookie: `access_token=${jwt1}`,
      },
    },
  );

  expect(res.status).toEqual(204);
  expect(res.body).toBeEmpty();
  const { rowCount } = await db.query(
    "select count(*) from transaction where id = $1 and cancelled_at is not null",
    [transaction.id],
  );
  expect(rowCount).toEqual(1);
  expect(mockPublishEvent).toHaveBeenLastCalledWith(
    "transaction",
    "transaction.cancelled",
    {
      ...transaction,
      createdAt: expect.any(Date),
      cancelledAt: expect.any(Date),
    },
  );
});

it("returns 401 if not logged in", async () => {
  const res = await POST(`/transactions/${crypto.randomUUID()}/complete`, {});
  const body = await res.json();

  expect(res.status).toEqual(401);
  expect(body).toEqual({ error: expect.any(String) });
});

it("returns 404 if transaction is not found", async () => {
  const res = await POST(
    `/transactions/${crypto.randomUUID()}/complete`,
    {},
    {
      headers: {
        Cookie: `access_token=${jwt2}`,
      },
    },
  );
  const body = await res.json();

  expect(res.status).toEqual(404);
  expect(body).toEqual({ error: expect.any(String) });
});

it("returns 403 if someone other than seller tries to cancel", async () => {
  const transaction: Transaction = {
    id: crypto.randomUUID(),
    item: {
      id: crypto.randomUUID(),
      name: "test",
      price: 100,
    },
    seller: participant1,
    buyer: participant2,
    createdAt: new Date().toISOString(),
    completedAt: null,
    cancelledAt: null,
  };
  await db.query(
    "insert into transaction (id, item_id, item_name, item_price, seller_id, seller_nickname, seller_avatar_url, buyer_id, buyer_nickname, buyer_avatar_url, created_at) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)",
    [
      transaction.id,
      transaction.item.id,
      transaction.item.name,
      transaction.item.price,
      transaction.seller.id,
      transaction.seller.nickname,
      transaction.seller.avatarUrl,
      transaction.buyer.id,
      transaction.buyer.nickname,
      transaction.buyer.avatarUrl,
      transaction.createdAt,
    ],
  );

  const res = await POST(
    `/transactions/${transaction.id}/cancel`,
    {},
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

it("returns 409 if transaction is already completed", async () => {
  const transaction: Transaction = {
    id: crypto.randomUUID(),
    item: {
      id: crypto.randomUUID(),
      name: "test",
      price: 100,
    },
    seller: participant1,
    buyer: participant2,
    createdAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
    cancelledAt: null,
  };
  await db.query(
    "insert into transaction (id, item_id, item_name, item_price, seller_id, seller_nickname, seller_avatar_url, buyer_id, buyer_nickname, buyer_avatar_url, created_at, completed_at) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)",
    [
      transaction.id,
      transaction.item.id,
      transaction.item.name,
      transaction.item.price,
      transaction.seller.id,
      transaction.seller.nickname,
      transaction.seller.avatarUrl,
      transaction.buyer.id,
      transaction.buyer.nickname,
      transaction.buyer.avatarUrl,
      transaction.createdAt,
      transaction.completedAt,
    ],
  );

  const res = await POST(
    `/transactions/${transaction.id}/cancel`,
    {},
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

it("returns 409 if transaction is already cancelled", async () => {
  const transaction: Transaction = {
    id: crypto.randomUUID(),
    item: {
      id: crypto.randomUUID(),
      name: "test",
      price: 100,
    },
    seller: participant1,
    buyer: participant2,
    createdAt: new Date().toISOString(),
    completedAt: null,
    cancelledAt: new Date().toISOString(),
  };
  await db.query(
    "insert into transaction (id, item_id, item_name, item_price, seller_id, seller_nickname, seller_avatar_url, buyer_id, buyer_nickname, buyer_avatar_url, created_at, cancelled_at) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)",
    [
      transaction.id,
      transaction.item.id,
      transaction.item.name,
      transaction.item.price,
      transaction.seller.id,
      transaction.seller.nickname,
      transaction.seller.avatarUrl,
      transaction.buyer.id,
      transaction.buyer.nickname,
      transaction.buyer.avatarUrl,
      transaction.createdAt,
      transaction.cancelledAt,
    ],
  );

  const res = await POST(
    `/transactions/${transaction.id}/cancel`,
    {},
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
