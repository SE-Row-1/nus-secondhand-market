import { findOneById } from "@/items/repository";
import type { Item } from "@/types";
import { itemsCollection } from "@/utils/db";
import { afterAll, afterEach, expect, it, mock, spyOn } from "bun:test";
import { type WithId } from "mongodb";

const mockFindOne = spyOn(itemsCollection, "findOne");

afterEach(() => {
  mockFindOne.mockClear();
});

afterAll(() => {
  mock.restore();
});

it("finds item", async () => {
  const item = { id: crypto.randomUUID() } as Item;
  mockFindOne.mockResolvedValueOnce(item);

  const result = await findOneById(item.id);

  expect(result).toEqual(item as WithId<Item>);
  expect(mockFindOne).toHaveBeenLastCalledWith(
    { id: item.id, deletedAt: null },
    { projection: { _id: 0 } },
  );
});
