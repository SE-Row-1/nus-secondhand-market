import { insertOne } from "@/transactions/repository";
import { afterEach, beforeEach, expect, it, mock } from "bun:test";
import { participant1, participant2 } from "../../test-utils/data";

const mockQuery = mock();

beforeEach(() => {
  mock.module("@/utils/db", () => ({
    db: {
      query: mockQuery,
    },
  }));
});

afterEach(() => {
  mock.restore();
});

it("returns the inserted transaction", async () => {
  const item = {
    id: crypto.randomUUID(),
    name: "test",
    price: 100,
  };
  mockQuery.mockResolvedValueOnce({
    rows: [
      {
        id: crypto.randomUUID(),
        item_id: item.id,
        item_name: item.name,
        item_price: item.price,
        buyer_id: participant2.id,
        buyer_nickname: participant2.nickname,
        buyer_avatar_url: participant2.avatarUrl,
        seller_id: participant1.id,
        seller_nickname: participant1.nickname,
        seller_avatar_url: participant1.avatarUrl,
        created_at: new Date().toISOString(),
        completed_at: null,
        cancelled_at: null,
      },
    ],
  });

  const result = await insertOne({
    item,
    buyer: participant2,
    seller: participant1,
  });

  expect(result).toEqual({
    id: expect.any(String),
    item,
    buyer: participant2,
    seller: participant1,
    createdAt: expect.any(String),
    completedAt: null,
    cancelledAt: null,
  });
  expect(mockQuery).toHaveBeenLastCalledWith(expect.any(String), [
    item.id,
    item.name,
    item.price,
    participant2.id,
    participant2.nickname,
    participant2.avatarUrl,
    participant1.id,
    participant1.nickname,
    participant1.avatarUrl,
  ]);
});
