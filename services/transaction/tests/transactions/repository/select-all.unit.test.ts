import { selectAll } from "@/transactions/repository";
import { afterAll, beforeAll, expect, it, mock } from "bun:test";

const mockQuery = mock();

beforeAll(() => {
  mock.module("@/utils/db", () => ({
    db: {
      query: mockQuery,
    },
  }));
});

afterAll(() => {
  mock.restore();
});

it("transforms rows", async () => {
  mockQuery.mockResolvedValueOnce({
    rows: [
      {
        id: crypto.randomUUID(),
        item_id: crypto.randomUUID(),
        item_name: "test",
        item_price: 100,
        buyer_id: 1,
        buyer_nickname: "buyer",
        buyer_avatar_url: "buyer.png",
        seller_id: 2,
        seller_nickname: "seller",
        seller_avatar_url: "seller.png",
        created_at: new Date().toISOString(),
        completed_at: null,
        cancelled_at: null,
      },
    ],
  });

  const result = await selectAll({
    itemId: undefined,
    participantId: 1,
    excludeCancelled: true,
  });

  expect(result).toHaveLength(1);
  expect(result[0]).toEqual({
    id: expect.any(String),
    item: {
      id: expect.any(String),
      name: "test",
      price: 100,
    },
    buyer: {
      id: 1,
      nickname: "buyer",
      avatarUrl: "buyer.png",
    },
    seller: {
      id: 2,
      nickname: "seller",
      avatarUrl: "seller.png",
    },
    createdAt: expect.any(String),
    completedAt: null,
    cancelledAt: null,
  });
  expect(mockQuery).toHaveBeenLastCalledWith(expect.any(String), [
    undefined,
    1,
    true,
  ]);
});
