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

it("completes transaction", async () => {
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
    "insert into transaction (id, item_id, item_name, item_price, seller_id, seller_email, seller_nickname, seller_avatar_url, buyer_id, buyer_email, buyer_nickname, buyer_avatar_url, created_at) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)",
    [
      transaction.id,
      transaction.item.id,
      transaction.item.name,
      transaction.item.price,
      transaction.seller.id,
      transaction.seller.email,
      transaction.seller.nickname,
      transaction.seller.avatarUrl,
      transaction.buyer.id,
      transaction.buyer.email,
      transaction.buyer.nickname,
      transaction.buyer.avatarUrl,
      transaction.createdAt,
    ],
  );

  const res = await POST(
    `/transactions/${transaction.id}/complete`,
    {},
    {
      headers: {
        Cookie: `access_token=${jwt2}`,
      },
    },
  );

  expect(res.status).toEqual(204);
  expect(res.body).toBeEmpty();
  const { rowCount } = await db.query(
    "select count(*) from transaction where id = $1 and completed_at is not null",
    [transaction.id],
  );
  expect(rowCount).toEqual(1);
  expect(mockPublishEvent).toHaveBeenNthCalledWith(
    1,
    "transaction",
    "transaction.completed",
    {
      ...transaction,
      createdAt: new Date(transaction.createdAt),
      completedAt: expect.any(Date),
    },
  );
  expect(mockPublishEvent).toHaveBeenNthCalledWith(
    2,
    "notification",
    "batch-email",
    {
      emails: [
        {
          to: transaction.seller.email,
          title: expect.any(String),
          content: expect.stringContaining(
            transaction.seller.nickname ?? transaction.seller.email,
          ),
        },
        {
          to: transaction.buyer.email,
          title: expect.any(String),
          content: expect.stringContaining(
            transaction.buyer.nickname ?? transaction.buyer.email,
          ),
        },
      ],
    },
  );
});

it("returns 401 if not logged in", async () => {
  const res = await POST(`/transactions/${crypto.randomUUID()}/complete`);
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

it("returns 403 if someone other than buyer tries to complete", async () => {
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
    "insert into transaction (id, item_id, item_name, item_price, seller_id, seller_email, seller_nickname, seller_avatar_url, buyer_id, buyer_email, buyer_nickname, buyer_avatar_url, created_at) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)",
    [
      transaction.id,
      transaction.item.id,
      transaction.item.name,
      transaction.item.price,
      transaction.seller.id,
      transaction.seller.email,
      transaction.seller.nickname,
      transaction.seller.avatarUrl,
      transaction.buyer.id,
      transaction.buyer.email,
      transaction.buyer.nickname,
      transaction.buyer.avatarUrl,
      transaction.createdAt,
    ],
  );

  const res = await POST(
    `/transactions/${transaction.id}/complete`,
    {},
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
    "insert into transaction (id, item_id, item_name, item_price, seller_id, seller_email, seller_nickname, seller_avatar_url, buyer_id, buyer_email, buyer_nickname, buyer_avatar_url, created_at, completed_at) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)",
    [
      transaction.id,
      transaction.item.id,
      transaction.item.name,
      transaction.item.price,
      transaction.seller.id,
      transaction.seller.email,
      transaction.seller.nickname,
      transaction.seller.avatarUrl,
      transaction.buyer.id,
      transaction.buyer.email,
      transaction.buyer.nickname,
      transaction.buyer.avatarUrl,
      transaction.createdAt,
      transaction.completedAt,
    ],
  );

  const res = await POST(
    `/transactions/${transaction.id}/complete`,
    {},
    {
      headers: {
        Cookie: `access_token=${jwt2}`,
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
    "insert into transaction (id, item_id, item_name, item_price, seller_id, seller_email, seller_nickname, seller_avatar_url, buyer_id, buyer_email, buyer_nickname, buyer_avatar_url, created_at, cancelled_at) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)",
    [
      transaction.id,
      transaction.item.id,
      transaction.item.name,
      transaction.item.price,
      transaction.seller.id,
      transaction.seller.email,
      transaction.seller.nickname,
      transaction.seller.avatarUrl,
      transaction.buyer.id,
      transaction.buyer.email,
      transaction.buyer.nickname,
      transaction.buyer.avatarUrl,
      transaction.createdAt,
      transaction.cancelledAt,
    ],
  );

  const res = await POST(
    `/transactions/${transaction.id}/complete`,
    {},
    {
      headers: {
        Cookie: `access_token=${jwt2}`,
      },
    },
  );
  const body = await res.json();

  expect(res.status).toEqual(409);
  expect(body).toEqual({ error: expect.any(String) });
});
