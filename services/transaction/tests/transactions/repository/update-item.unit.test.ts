import { updateItem } from "@/transactions/repository";
import { db } from "@/utils/db";
import { afterAll, afterEach, expect, it, mock, spyOn } from "bun:test";

const mockQuery = spyOn(db, "query");

afterEach(() => {
  mockQuery.mockClear();
});

afterAll(() => {
  mock.restore();
});

it("returns row count", async () => {
  const item = {
    id: crypto.randomUUID(),
    name: "item",
    price: 100,
  };
  mockQuery.mockResolvedValueOnce({ rowCount: 1 } as never);

  const result = await updateItem(item);

  expect(result).toEqual(1);
  expect(mockQuery).toHaveBeenLastCalledWith(expect.any(String), [
    item.id,
    item.name,
    item.price,
  ]);
});
