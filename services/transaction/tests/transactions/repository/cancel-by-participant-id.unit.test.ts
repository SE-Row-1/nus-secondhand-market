import { cancelByParticipantId } from "@/transactions/repository";
import { db } from "@/utils/db";
import { afterAll, afterEach, expect, it, mock, spyOn } from "bun:test";

const mockQuery = spyOn(db, "query");

afterEach(() => {
  mockQuery.mockClear();
});

afterAll(() => {
  mock.restore();
});

it("returns row count", async () => {
  const participantId = 1;
  mockQuery.mockResolvedValueOnce({ rowCount: 1 } as never);

  const result = await cancelByParticipantId(participantId);

  expect(result).toEqual(1);
  expect(mockQuery).toHaveBeenLastCalledWith(expect.any(String), [
    participantId,
  ]);
});
