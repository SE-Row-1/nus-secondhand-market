import { selectOneById } from "@/transactions/repository";
import { afterAll, beforeAll, expect, it, mock } from "bun:test";
import { participant1, participant2 } from "../../test-utils/data";

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

it("returns one row", async () => {
  const id = crypto.randomUUID();
  const item = {
    id: crypto.randomUUID(),
    name: "test",
    price: 100,
  };
  mockQuery.mockResolvedValueOnce({
    rows: [
      {
        id,
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

  const result = await selectOneById(id);

  expect(result).toEqual({
    id,
    item,
    buyer: participant2,
    seller: participant1,
    createdAt: expect.any(String),
    completedAt: null,
    cancelledAt: null,
  });
  expect(mockQuery).toHaveBeenLastCalledWith(expect.any(String), [id]);
});
