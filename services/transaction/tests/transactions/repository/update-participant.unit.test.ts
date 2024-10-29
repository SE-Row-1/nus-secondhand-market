import { updateParticipant } from "@/transactions/repository";
import { afterAll, beforeAll, expect, it, mock } from "bun:test";
import { participant1 } from "../../test-utils/data";

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

  const result = await updateParticipant(participant1);

  expect(result).toEqual(5);
  expect(mockQuery).toHaveBeenLastCalledWith(expect.any(String), [
    participant1.id,
    participant1.nickname,
    participant1.avatarUrl,
  ]);
});
