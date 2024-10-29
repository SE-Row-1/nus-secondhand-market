import { cancelByParticipantId } from "@/transactions/repository";
import { afterEach, beforeEach, expect, it, mock } from "bun:test";
import { participant1 } from "../../test-utils/data";

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

it("returns row count", async () => {
  mockQuery.mockResolvedValueOnce({ rowCount: 1 });

  const result = await cancelByParticipantId(participant1.id);

  expect(result).toEqual(1);
  expect(mockQuery).toHaveBeenLastCalledWith(expect.any(String), [
    participant1.id,
  ]);
});
