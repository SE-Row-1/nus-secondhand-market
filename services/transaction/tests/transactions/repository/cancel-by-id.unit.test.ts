import { cancelById } from "@/transactions/repository";
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
  const id = crypto.randomUUID();
  mockQuery.mockResolvedValueOnce({
    rowCount: 1,
  });

  const result = await cancelById(id);

  expect(result).toEqual(1);
  expect(mockQuery).toHaveBeenLastCalledWith(expect.any(String), [id]);
});
