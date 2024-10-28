import { selectOneById } from "@/transactions/repository";
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

  const result = await selectOneById(id);

  expect(result).toEqual({
    id,
    item,
    buyer: someone.participant,
    seller: me.participant,
    createdAt: expect.any(String),
    completedAt: null,
    cancelledAt: null,
  });
  expect(mockQuery).toHaveBeenLastCalledWith(expect.any(String), [id]);
});
