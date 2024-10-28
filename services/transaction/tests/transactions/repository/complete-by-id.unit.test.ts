import { completeById } from "@/transactions/repository";
import { afterAll, beforeAll, expect, it, mock } from "bun:test";

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

it("returns row count", async () => {
  const id = crypto.randomUUID();
  mockQuery.mockResolvedValueOnce({
    rowCount: 1,
  });

  const result = await completeById(id);

  expect(result).toEqual(1);
  expect(mockQuery).toHaveBeenLastCalledWith(expect.any(String), [id]);
});
