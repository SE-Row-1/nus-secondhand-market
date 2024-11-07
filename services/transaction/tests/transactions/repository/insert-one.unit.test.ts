import { insertOne } from "@/transactions/repository";
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

it("returns inserted transaction", async () => {
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
        seller_id: participant1.id,
        seller_nickname: participant1.nickname,
        seller_avatar_url: participant1.avatarUrl,
        buyer_id: participant2.id,
        buyer_nickname: participant2.nickname,
        buyer_avatar_url: participant2.avatarUrl,
        created_at: new Date().toISOString(),
        completed_at: null,
        cancelled_at: null,
      },
    ],
  } as never);

  const result = await insertOne({
    item,
    seller: participant1,
    buyer: participant2,
  });

  expect(result).toEqual({
    id: expect.any(String),
    item,
    seller: participant1,
    buyer: participant2,
    createdAt: expect.any(String),
    completedAt: null,
    cancelledAt: null,
  });
  expect(mockQuery).toHaveBeenLastCalledWith(expect.any(String), [
    item.id,
    item.name,
    item.price,
    participant1.id,
    participant1.nickname,
    participant1.avatarUrl,
    participant2.id,
    participant2.nickname,
    participant2.avatarUrl,
  ]);
});
