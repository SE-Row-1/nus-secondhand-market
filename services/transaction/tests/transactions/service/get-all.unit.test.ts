import * as transactionsRepository from "@/transactions/repository";
import { getAll } from "@/transactions/service";
import { afterAll, afterEach, expect, it, mock, spyOn } from "bun:test";
import { participant1 } from "../../test-utils/data";

const mockSelectMany = spyOn(transactionsRepository, "selectMany");

afterEach(() => {
  mockSelectMany.mockClear();
});

afterAll(() => {
  mock.restore();
});

it("returns transactions", async () => {
  const itemId = crypto.randomUUID();
  mockSelectMany.mockResolvedValueOnce([]);

  const result = await getAll({
    itemId: itemId,
    isCancelled: false,
    user: participant1,
  });

  expect(result).toEqual([]);
  expect(mockSelectMany).toHaveBeenLastCalledWith({
    itemId,
    isCompleted: undefined,
    isCancelled: false,
    participantId: participant1.id,
  });
});
