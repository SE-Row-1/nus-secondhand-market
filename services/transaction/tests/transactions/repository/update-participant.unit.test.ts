import { updateParticipant } from "@/transactions/repository";
import { afterAll, beforeAll, expect, it, mock } from "bun:test";
import { me } from "../../test-utils/mock";

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

it("returns total row count", async () => {
  mockQuery
    .mockResolvedValueOnce({ rowCount: 2 })
    .mockResolvedValueOnce({ rowCount: 3 });

  const result = await updateParticipant(me.participant);

  expect(result).toEqual(5);
  expect(mockQuery).toHaveBeenLastCalledWith(expect.any(String), [
    me.participant.id,
    me.participant.nickname,
    me.participant.avatarUrl,
  ]);
});
