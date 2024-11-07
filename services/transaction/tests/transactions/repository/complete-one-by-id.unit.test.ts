import { completeOneById } from "@/transactions/repository";
import type { Transaction } from "@/types";
import { db } from "@/utils/db";
import { afterAll, afterEach, expect, it, mock, spyOn } from "bun:test";
import { participant1, participant2 } from "../../test-utils/data";

const mockQuery = spyOn(db, "query");

afterEach(() => {
  mockQuery.mockClear();
});

afterAll(() => {
  mock.restore();
});

it("returns completed transaction", async () => {
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
  mockQuery.mockResolvedValueOnce({
    rows: [
      {
        id: transaction.id,
        item_id: transaction.item.id,
        item_name: transaction.item.name,
        item_price: transaction.item.price,
        seller_id: transaction.seller.id,
        seller_nickname: transaction.seller.nickname,
        seller_avatar_url: transaction.seller.avatarUrl,
        buyer_id: transaction.buyer.id,
        buyer_nickname: transaction.buyer.nickname,
        buyer_avatar_url: transaction.buyer.avatarUrl,
        created_at: transaction.createdAt,
        completed_at: new Date().toISOString(),
        cancelled_at: transaction.cancelledAt,
      },
    ],
  } as never);

  const result = await completeOneById(transaction.id);

  expect(result).toEqual({ ...transaction, completedAt: expect.any(String) });
  expect(mockQuery).toHaveBeenLastCalledWith(expect.any(String), [
    transaction.id,
  ]);
});

it("returns undefined if transaction is not found or not eligible", async () => {
  const id = crypto.randomUUID();
  mockQuery.mockResolvedValueOnce({ rows: [] } as never);

  const result = await completeOneById(id);

  expect(result).toBeUndefined();
  expect(mockQuery).toHaveBeenLastCalledWith(expect.any(String), [id]);
});
