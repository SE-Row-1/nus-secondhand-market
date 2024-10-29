import { getAll } from "@/transactions/service";
import { afterAll, beforeAll, expect, it, mock } from "bun:test";
import { participant1 } from "../../test-utils/data";

const mockSelectAll = mock();

beforeAll(() => {
  mock.module("@/transactions/repository", () => ({
    selectAll: mockSelectAll,
  }));
});

afterAll(() => {
  mock.restore();
});

it("returns transactions found by repository", async () => {
  mockSelectAll.mockResolvedValueOnce([]);

  const result = await getAll({ excludeCancelled: true, user: participant1 });

  expect(result).toEqual([]);
  expect(mockSelectAll).toHaveBeenLastCalledWith({
    itemId: undefined,
    excludeCancelled: true,
    participantId: participant1.id,
  });
});
