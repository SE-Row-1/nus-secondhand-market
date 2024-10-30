import { cancelOneById } from "@/transactions/repository";
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

it("returns row count", async () => {
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
        completed_at: transaction.completedAt,
        cancelled_at: new Date().toISOString(),
      },
    ],
  } as never);

  const result = await cancelOneById(transaction.id);

  expect(result).toEqual({ ...transaction, cancelledAt: expect.any(String) });
  expect(mockQuery).toHaveBeenLastCalledWith(expect.any(String), [
    transaction.id,
  ]);
});
