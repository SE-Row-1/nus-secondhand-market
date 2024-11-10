import * as itemsRepository from "@/items/repository";
import { getOne } from "@/items/service";
import { ItemStatus, ItemType, type Item } from "@/types";
import * as requester from "@/utils/requester";
import { afterAll, afterEach, expect, it, mock, spyOn } from "bun:test";
import { HTTPException } from "hono/http-exception";
import type { WithId } from "mongodb";
import { account1, seller1 } from "../../test-utils/data";

const mockFindOneById = spyOn(itemsRepository, "findOneById");
const mockAccountRequester = mock();
const mockCreateRequester = spyOn(
  requester,
  "createRequester",
).mockImplementation(() => mockAccountRequester);

afterEach(() => {
  mockFindOneById.mockClear();
  mockAccountRequester.mockClear();
  mockCreateRequester.mockClear();
});

afterAll(() => {
  mock.restore();
});

it("gets item", async () => {
  const item: Item = {
    id: crypto.randomUUID(),
    type: ItemType.Single,
    name: "test",
    description: "test",
    price: 100,
    photoUrls: [],
    seller: seller1,
    status: ItemStatus.ForSale,
    createdAt: new Date(),
    deletedAt: null,
  };
  mockFindOneById.mockResolvedValueOnce(item as WithId<Item>);
  mockAccountRequester.mockResolvedValueOnce(account1);

  const result = await getOne({ id: item.id });

  expect(result).toEqual({ ...item, seller: account1 } as never);
  expect(mockFindOneById).toHaveBeenLastCalledWith(item.id);
  expect(mockAccountRequester).toHaveBeenLastCalledWith(
    `/accounts/${item.seller.id}`,
  );
});

it("throws HTTPException 404 if item not found", async () => {
  mockFindOneById.mockResolvedValueOnce(null);

  const promise = getOne({ id: crypto.randomUUID() });

  expect(promise).rejects.toBeInstanceOf(HTTPException);
  expect(promise).rejects.toHaveProperty("status", 404);
});

it("throws HTTPException 404 if seller not found", async () => {
  const item: Item = {
    id: crypto.randomUUID(),
    type: ItemType.Single,
    name: "test",
    description: "test",
    price: 100,
    photoUrls: [],
    seller: seller1,
    status: ItemStatus.ForSale,
    createdAt: new Date(),
    deletedAt: null,
  };
  mockFindOneById.mockResolvedValueOnce(item as WithId<Item>);
  mockAccountRequester.mockRejectedValueOnce(
    new HTTPException(404, { message: "test" }),
  );

  const promise = getOne({ id: item.id });

  expect(promise).rejects.toBeInstanceOf(HTTPException);
  expect(promise).rejects.toHaveProperty("status", 404);
});
