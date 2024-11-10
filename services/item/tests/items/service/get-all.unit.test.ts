import * as itemsRepository from "@/items/repository";
import { getAll } from "@/items/service";
import { ItemStatus, ItemType } from "@/types";
import { afterAll, afterEach, expect, it, mock, spyOn } from "bun:test";

const mockFindMany = spyOn(itemsRepository, "findMany");

afterEach(() => {
  mockFindMany.mockClear();
});

afterAll(() => {
  mock.restore();
});

it("gets items", async () => {
  mockFindMany.mockResolvedValueOnce({ items: [], nextCursor: null });

  const result = await getAll({ limit: 10 });

  expect(result).toEqual({ items: [], nextCursor: null });
  expect(mockFindMany).toHaveBeenLastCalledWith({
    type: undefined,
    status: undefined,
    sellerId: undefined,
    limit: 10,
    cursor: undefined,
  });
});

it("accepts filter", async () => {
  mockFindMany.mockResolvedValueOnce({ items: [], nextCursor: null });

  const result = await getAll({
    type: ItemType.Single,
    status: ItemStatus.ForSale,
    sellerId: 1,
    limit: 10,
    cursor: "test",
  });

  expect(result).toEqual({ items: [], nextCursor: null });
  expect(mockFindMany).toHaveBeenLastCalledWith({
    type: ItemType.Single,
    status: ItemStatus.ForSale,
    sellerId: 1,
    limit: 10,
    cursor: "test",
  });
});
