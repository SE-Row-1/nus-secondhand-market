import { deleteOneById } from "@/items/repository";
import { itemsCollection } from "@/utils/db";
import { afterAll, afterEach, expect, it, mock, spyOn } from "bun:test";
import type { UpdateResult } from "mongodb";

const mockUpdateOne = spyOn(itemsCollection, "updateOne");

afterEach(() => {
  mockUpdateOne.mockClear();
});

afterAll(() => {
  mock.restore();
});

it("soft deletes item", async () => {
  const id = crypto.randomUUID();
  mockUpdateOne.mockResolvedValueOnce({} as UpdateResult);

  await deleteOneById(id);

  expect(mockUpdateOne).toHaveBeenLastCalledWith(
    { id, deletedAt: null },
    { $set: { deletedAt: expect.any(Date) } },
  );
});
