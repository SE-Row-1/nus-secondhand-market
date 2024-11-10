import * as itemsRepository from "@/items/repository";
import { search } from "@/items/service";
import { afterAll, afterEach, expect, it, mock, spyOn } from "bun:test";

const mockSearch = spyOn(itemsRepository, "search");

afterEach(() => {
  mockSearch.mockClear();
});

afterAll(() => {
  mock.restore();
});

it("searches items", async () => {
  mockSearch.mockResolvedValueOnce({
    items: [],
    nextCursor: null,
    nextThreshold: 0,
  });

  const result = await search({ q: "test", limit: 10 });

  expect(result).toEqual({ items: [], nextCursor: null, nextThreshold: 0 });
  expect(mockSearch).toHaveBeenLastCalledWith({
    q: "test",
    limit: 10,
    cursor: undefined,
    threshold: undefined,
  });
});

it("accepts optional parameters", async () => {
  mockSearch.mockResolvedValueOnce({
    items: [],
    nextCursor: null,
    nextThreshold: 0,
  });

  const result = await search({
    q: "test",
    limit: 10,
    cursor: "test",
    threshold: 0.5,
  });

  expect(result).toEqual({ items: [], nextCursor: null, nextThreshold: 0 });
  expect(mockSearch).toHaveBeenLastCalledWith({
    q: "test",
    limit: 10,
    cursor: "test",
    threshold: 0.5,
  });
});
