import { updateItem } from "@/transactions/repository";
import { afterAll, beforeAll, expect, it, mock } from "bun:test";

const mockQuery = mock();

beforeAll(() => {
  mock.module("@/utils/db", () => ({
    db: {
      query: mockQuery,
    },
  }));
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
  mockQuery.mockResolvedValueOnce({ rowCount: 1 });

  const result = await updateItem(item);

  expect(result).toEqual(1);
  expect(mockQuery).toHaveBeenLastCalledWith(expect.any(String), [
    item.id,
    item.name,
    item.price,
  ]);
});
