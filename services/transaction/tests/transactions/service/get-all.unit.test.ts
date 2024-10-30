import * as transactionsRepository from "@/transactions/repository";
import { getAll } from "@/transactions/service";
import { afterAll, afterEach, expect, it, mock, spyOn } from "bun:test";
import { participant1 } from "../../test-utils/data";

const mockSelectAll = spyOn(transactionsRepository, "selectAll");

afterEach(() => {
  mockSelectAll.mockClear();
});

afterAll(() => {
  mock.restore();
});

it("returns transactions", async () => {
  mockSelectAll.mockResolvedValueOnce([]);

  const result = await getAll({ excludeCancelled: true, user: participant1 });

  expect(result).toEqual([]);
  expect(mockSelectAll).toHaveBeenLastCalledWith({
    itemId: undefined,
    excludeCancelled: true,
    participantId: participant1.id,
  });
});
