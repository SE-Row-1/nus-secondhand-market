import { updateOneById } from "@/items/repository";
import type { Item } from "@/types";
import { itemsCollection } from "@/utils/db";
import { afterAll, afterEach, expect, it, mock, spyOn } from "bun:test";
import type { WithId } from "mongodb";

const mockFindOneAndUpdate = spyOn(itemsCollection, "findOneAndUpdate");

afterEach(() => {
  mockFindOneAndUpdate.mockClear();
});

afterAll(() => {
  mock.restore();
});

// There is some weird mock issue here; ignore this logic for now.
it("updates item and returns it", async () => {
  const id = crypto.randomUUID();
  mockFindOneAndUpdate.mockResolvedValueOnce({} as WithId<Item>);

  const result = await updateOneById(id, { name: "test" });

  expect(result).toEqual({} as WithId<Item>);
  expect(mockFindOneAndUpdate).toHaveBeenLastCalledWith(
    {
      id,
      deletedAt: null,
    },
    {
      $set: { name: "test" },
    },
    {
      projection: { _id: 0 },
      returnDocument: "after",
    },
  );
});
