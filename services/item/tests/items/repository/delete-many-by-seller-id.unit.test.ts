import { deleteManyBySellerId } from "@/items/repository";
import { itemsCollection } from "@/utils/db";
import { afterAll, afterEach, expect, it, mock, spyOn } from "bun:test";
import type { UpdateResult } from "mongodb";

const mockUpdateMany = spyOn(itemsCollection, "updateMany");

afterEach(() => {
  mockUpdateMany.mockClear();
});

afterAll(() => {
  mock.restore();
});

it("deletes items by seller id", async () => {
  mockUpdateMany.mockResolvedValueOnce({} as UpdateResult);

  await deleteManyBySellerId(1);

  expect(mockUpdateMany).toHaveBeenLastCalledWith(
    { "seller.id": 1, deletedAt: null },
    { $set: { deletedAt: expect.any(Date) } },
  );
});
