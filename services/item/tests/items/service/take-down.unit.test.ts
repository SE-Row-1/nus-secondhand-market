import * as publish from "@/events/publish";
import * as itemsRepository from "@/items/repository";
import { takeDown } from "@/items/service";
import { ItemStatus, ItemType, type Item } from "@/types";
import { afterAll, afterEach, expect, it, mock, spyOn } from "bun:test";
import { HTTPException } from "hono/http-exception";
import type { UpdateResult, WithId } from "mongodb";
import { seller1, seller2 } from "../../test-utils/data";

const mockFindOneById = spyOn(itemsRepository, "findOneById");
const mockDeleteOneById = spyOn(itemsRepository, "deleteOneById");
const mockPublishEvent = spyOn(publish, "publishEvent");

afterEach(() => {
  mockFindOneById.mockClear();
  mockDeleteOneById.mockClear();
  mockPublishEvent.mockClear();
});

afterAll(() => {
  mock.restore();
});

it("takes down item", async () => {
  const item: Item = {
    id: crypto.randomUUID(),
    type: ItemType.Single,
    name: "test",
    description: "test",
    price: 100,
    photoUrls: ["test1.jpg"],
    seller: seller1,
    status: ItemStatus.ForSale,
    createdAt: new Date(),
    deletedAt: null,
  };
  mockFindOneById.mockResolvedValueOnce(item as WithId<Item>);
  mockDeleteOneById.mockResolvedValueOnce({} as UpdateResult);

  await takeDown({ id: item.id, user: seller1 });

  expect(mockFindOneById).toHaveBeenLastCalledWith(item.id);
  expect(mockDeleteOneById).toHaveBeenLastCalledWith(item.id);
  expect(mockPublishEvent).toHaveBeenLastCalledWith(
    "item",
    "item.deleted",
    item.id,
  );
});

it("throws HTTPException 404 if item not found", async () => {
  mockFindOneById.mockResolvedValueOnce(null);

  const promise = takeDown({ id: crypto.randomUUID(), user: seller1 });

  expect(promise).rejects.toBeInstanceOf(HTTPException);
  expect(promise).rejects.toHaveProperty("status", 404);
});

it("throws HTTPException 422 if item type is not single", async () => {
  const item: Item = {
    id: crypto.randomUUID(),
    type: ItemType.Pack,
    name: "test",
    description: "test",
    price: 100,
    discount: 0,
    children: [],
    seller: seller1,
    status: ItemStatus.ForSale,
    createdAt: new Date(),
    deletedAt: null,
  };
  mockFindOneById.mockResolvedValueOnce(item as WithId<Item>);

  const promise = takeDown({ id: item.id, user: seller1 });

  expect(promise).rejects.toBeInstanceOf(HTTPException);
  expect(promise).rejects.toHaveProperty("status", 422);
});

it("throws HTTPException 403 if user is not the seller", async () => {
  const item: Item = {
    id: crypto.randomUUID(),
    type: ItemType.Single,
    name: "test",
    description: "test",
    price: 100,
    photoUrls: [],
    seller: seller2,
    status: ItemStatus.ForSale,
    createdAt: new Date(),
    deletedAt: null,
  };
  mockFindOneById.mockResolvedValueOnce(item as WithId<Item>);

  const promise = takeDown({ id: item.id, user: seller1 });

  expect(promise).rejects.toBeInstanceOf(HTTPException);
  expect(promise).rejects.toHaveProperty("status", 403);
});
