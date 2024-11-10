import { findMany } from "@/items/repository";
import { ItemStatus, ItemType, type Item } from "@/types";
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

it("finds items", async () => {
  const withIdItems = [
    { _id: new ObjectId(), id: crypto.randomUUID() },
    { _id: new ObjectId(), id: crypto.randomUUID() },
  ] as WithId<Item>[];
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const items: Item[] = withIdItems.map(({ _id, ...rest }) => rest);
  mockFind.mockReturnValueOnce({ toArray: () => withIdItems } as never);

  const result = await findMany({
    type: undefined,
    status: undefined,
    sellerId: undefined,
    limit: 10,
    cursor: undefined,
  });

  expect(result).toEqual({ items, nextCursor: null });
  expect(mockFind).toHaveBeenLastCalledWith(
    { deletedAt: null },
    { sort: { _id: -1 }, limit: 10 },
  );
});

it("accepts filter", async () => {
  const withIdItems = [
    { _id: new ObjectId(), id: crypto.randomUUID() },
    { _id: new ObjectId(), id: crypto.randomUUID() },
  ] as WithId<Item>[];
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const items: Item[] = withIdItems.map(({ _id, ...rest }) => rest);
  mockFind.mockReturnValueOnce({ toArray: () => withIdItems } as never);

  const result = await findMany({
    type: ItemType.Single,
    status: ItemStatus.ForSale,
    sellerId: 1,
    limit: 10,
    cursor: new ObjectId().toString(),
  });

  expect(result).toEqual({ items, nextCursor: null });
  expect(mockFind).toHaveBeenLastCalledWith(
    {
      type: ItemType.Single,
      status: ItemStatus.ForSale,
      "seller.id": 1,
      _id: { $lt: expect.any(ObjectId) },
      deletedAt: null,
    },
    { sort: { _id: -1 }, limit: 10 },
  );
});

it("returns non-null cursor if there are more items", async () => {
  const withIdItems = [
    { _id: new ObjectId(), id: crypto.randomUUID() },
    { _id: new ObjectId(), id: crypto.randomUUID() },
  ] as WithId<Item>[];
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const items: Item[] = withIdItems.map(({ _id, ...rest }) => rest);
  mockFind.mockReturnValueOnce({ toArray: () => withIdItems } as never);

  const result = await findMany({
    type: undefined,
    status: undefined,
    sellerId: undefined,
    limit: 2,
    cursor: undefined,
  });

  expect(result).toEqual({ items, nextCursor: withIdItems[1]!._id });
  expect(mockFind).toHaveBeenLastCalledWith(
    { deletedAt: null },
    { sort: { _id: -1 }, limit: 2 },
  );
});
