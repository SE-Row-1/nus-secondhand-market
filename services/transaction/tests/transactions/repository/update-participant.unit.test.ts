import { updateParticipant } from "@/transactions/repository";
import { db } from "@/utils/db";
import { afterAll, afterEach, expect, it, mock, spyOn } from "bun:test";
import { participant1 } from "../../test-utils/data";

const mockQuery = spyOn(db, "query");

afterEach(() => {
  mockQuery.mockClear();
});

afterAll(() => {
  mock.restore();
});

it("returns count of updated transactions", async () => {
  mockQuery
    .mockResolvedValueOnce({ rowCount: 2 } as never)
    .mockResolvedValueOnce({ rowCount: 3 } as never);

  const result = await updateParticipant(participant1);

  expect(result).toEqual(5);
  expect(mockQuery).toHaveBeenNthCalledWith(1, expect.any(String), [
    participant1.id,
    participant1.nickname,
    participant1.avatarUrl,
  ]);
  expect(mockQuery).toHaveBeenNthCalledWith(2, expect.any(String), [
    participant1.id,
    participant1.nickname,
    participant1.avatarUrl,
  ]);
});
