import { updateSeller } from "@/items/repository";
import { itemsCollection } from "@/utils/db";
import { afterAll, afterEach, expect, it, mock, spyOn } from "bun:test";
import type { UpdateResult } from "mongodb";
import { seller1 } from "../../test-utils/data";

const mockUpdateMany = spyOn(itemsCollection, "updateMany");

afterEach(() => {
  mockUpdateMany.mockClear();
});

afterAll(() => {
  mock.restore();
});

it("updates seller in items", async () => {
  mockUpdateMany.mockResolvedValueOnce({} as UpdateResult);

  await updateSeller(seller1);

  expect(mockUpdateMany).toHaveBeenLastCalledWith(
    { "seller.id": seller1.id },
    {
      $set: {
        "seller.nickname": seller1.nickname,
        "seller.avatarUrl": seller1.avatarUrl,
      },
    },
  );
});
