import { insertOne } from "@/items/repository";
import type { Item } from "@/types";
import { itemsCollection } from "@/utils/db";
import { afterAll, afterEach, expect, it, mock, spyOn } from "bun:test";
import type { InsertOneResult } from "mongodb";

const mockInsertOne = spyOn(itemsCollection, "insertOne");

afterEach(() => {
  mockInsertOne.mockClear();
});

afterAll(() => {
  mock.restore();
});

it("inserts item", async () => {
  const item = { id: crypto.randomUUID() } as Item;
  mockInsertOne.mockResolvedValueOnce({} as InsertOneResult);

  await insertOne(item);

  expect(mockInsertOne).toHaveBeenLastCalledWith(item);
});
