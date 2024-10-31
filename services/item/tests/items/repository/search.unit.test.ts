import { search } from "@/items/repository";
import type { Item } from "@/types";
import { itemsCollection } from "@/utils/db";
import { afterAll, afterEach, expect, it, mock, spyOn } from "bun:test";
import { ObjectId, type WithId } from "mongodb";

const mockAggregate = spyOn(itemsCollection, "aggregate");

afterEach(() => {
  mockAggregate.mockClear();
});

afterAll(() => {
  mock.restore();
});

it("searches items", async () => {
  const withIdItems = [
    { _id: new ObjectId(), id: crypto.randomUUID(), score: 0.8 },
    { _id: new ObjectId(), id: crypto.randomUUID(), score: 0.7 },
  ] as WithId<Item & { score: number }>[];
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const items: Item[] = withIdItems.map(({ _id, score, ...rest }) => rest);
  mockAggregate.mockReturnValueOnce(
    // @ts-expect-error works
    () => ({ toArray: () => withIdItems }) as never,
  );

  const result = await search({
    q: "test",
    limit: 10,
    cursor: undefined,
    threshold: undefined,
  });

  expect(result).toEqual({ items, nextCursor: null, nextThreshold: 0 });
});

it("accepts filter", async () => {
  const withIdItems = [
    { _id: new ObjectId(), id: crypto.randomUUID(), score: 0.8 },
    { _id: new ObjectId(), id: crypto.randomUUID(), score: 0.7 },
  ] as WithId<Item & { score: number }>[];
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const items: Item[] = withIdItems.map(({ _id, score, ...rest }) => rest);
  mockAggregate.mockReturnValueOnce(
    // @ts-expect-error works
    () => ({ toArray: () => withIdItems }) as never,
  );

  const result = await search({
    q: "test",
    limit: 10,
    cursor: new ObjectId().toString(),
    threshold: 0.5,
  });

  expect(result).toEqual({ items, nextCursor: null, nextThreshold: 0 });
});

it("returns non-null cursor if there are more items", async () => {
  const withIdItems = [
    { _id: new ObjectId(), id: crypto.randomUUID(), score: 0.8 },
    { _id: new ObjectId(), id: crypto.randomUUID(), score: 0.7 },
  ] as WithId<Item & { score: number }>[];
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const items: Item[] = withIdItems.map(({ _id, score, ...rest }) => rest);
  mockAggregate.mockReturnValueOnce(
    // @ts-expect-error works
    () => ({ toArray: () => withIdItems }) as never,
  );

  const result = await search({
    q: "test",
    limit: 2,
    cursor: undefined,
    threshold: undefined,
  });

  expect(result).toEqual({
    items,
    nextCursor: withIdItems[1]!._id,
    nextThreshold: withIdItems[1]!.score,
  });
});
