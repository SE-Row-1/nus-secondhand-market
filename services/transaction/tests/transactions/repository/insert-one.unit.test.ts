import { insertOne } from "@/transactions/repository";
import { afterAll, beforeAll, expect, it, mock } from "bun:test";
import { me, someone } from "../../test-utils/mock";

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
        buyer_id: someone.participant.id,
        buyer_nickname: someone.participant.nickname,
        buyer_avatar_url: someone.participant.avatarUrl,
        seller_id: me.participant.id,
        seller_nickname: me.participant.nickname,
        seller_avatar_url: me.participant.avatarUrl,
        created_at: new Date().toISOString(),
        completed_at: null,
        cancelled_at: null,
      },
    ],
  });

  const result = await insertOne({
    item,
    buyer: someone.participant,
    seller: me.participant,
  });

  expect(result).toEqual({
    id: expect.any(String),
    item,
    buyer: someone.participant,
    seller: me.participant,
    createdAt: expect.any(String),
    completedAt: null,
    cancelledAt: null,
  });
  expect(mockQuery).toHaveBeenLastCalledWith(expect.any(String), [
    item.id,
    item.name,
    item.price,
    someone.participant.id,
    someone.participant.nickname,
    someone.participant.avatarUrl,
    me.participant.id,
    me.participant.nickname,
    me.participant.avatarUrl,
  ]);
});
