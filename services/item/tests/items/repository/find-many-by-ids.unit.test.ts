import { findManyByIds } from "@/items/repository";
import type { Item } from "@/types";
import { itemsCollection } from "@/utils/db";
import { afterAll, afterEach, expect, it, mock, spyOn } from "bun:test";
import { ObjectId, type WithId } from "mongodb";

const mockFind = spyOn(itemsCollection, "find");

afterEach(() => {
  mockFind.mockClear();
});

afterAll(() => {
  mock.restore();
});

it("finds items by ids", async () => {
  const withIdItems = [
    { _id: new ObjectId(), id: crypto.randomUUID() },
    { _id: new ObjectId(), id: crypto.randomUUID() },
  ] as WithId<Item>[];
  const ids = withIdItems.map((item) => item.id);
  mockFind.mockReturnValueOnce({ toArray: () => withIdItems } as never);

  const result = await findManyByIds(ids);

  expect(result).toEqual(withIdItems);
  expect(mockFind).toHaveBeenLastCalledWith({
    id: { $in: ids },
    deletedAt: null,
  });
});
