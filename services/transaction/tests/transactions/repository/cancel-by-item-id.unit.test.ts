import { cancelByItemId } from "@/transactions/repository";
import { afterEach, beforeEach, expect, it, mock } from "bun:test";

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
  const itemId = crypto.randomUUID();
  mockQuery.mockResolvedValueOnce({ rowCount: 1 });

  const result = await cancelByItemId(itemId);

  expect(result).toEqual(1);
  expect(mockQuery).toHaveBeenLastCalledWith(expect.any(String), [itemId]);
});
