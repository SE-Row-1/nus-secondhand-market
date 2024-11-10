import * as publish from "@/events/publish";
import { decompose } from "@/item-packs/service";
import * as itemsRepository from "@/items/repository";
import { ItemStatus, ItemType } from "@/types";
import { afterAll, afterEach, expect, it, mock, spyOn } from "bun:test";
import { HTTPException } from "hono/http-exception";
import { BulkWriteResult, ObjectId } from "mongodb";
import { seller1, seller2 } from "../../test-utils/data";

const mockFindOneById = spyOn(itemsRepository, "findOneById");
const mockDecompose = spyOn(itemsRepository, "decompose");
const mockPublishEvent = spyOn(publish, "publishEvent");

afterEach(() => {
  mockFindOneById.mockClear();
  mockDecompose.mockClear();
  mockPublishEvent.mockClear();
});

afterAll(() => {
  mock.restore();
});

it("decomposes pack", async () => {
  mockFindOneById.mockResolvedValueOnce({
    _id: new ObjectId(),
    id: "1",
    type: ItemType.Pack,
    name: "test",
    description: "test",
    price: 10,
    discount: 0,
    children: [],
    seller: seller1,
    status: ItemStatus.ForSale,
    createdAt: new Date(),
    deletedAt: null,
  });
  mockDecompose.mockResolvedValueOnce({} as BulkWriteResult);

  await decompose({ id: "1", user: seller1 });

  expect(mockDecompose).toHaveBeenLastCalledWith(
    expect.objectContaining({ id: "1" }),
  );
  expect(mockPublishEvent).toHaveBeenLastCalledWith(
    "item",
    "item.deleted",
    "1",
  );
});

it("throws HTTPException 404 if pack not found", async () => {
  mockFindOneById.mockResolvedValueOnce(null);

  const promise = decompose({ id: "1", user: seller1 });

  expect(promise).rejects.toBeInstanceOf(HTTPException);
  expect(promise).rejects.toHaveProperty("status", 404);
});

it("throws HTTPException 422 if item is not a pack", async () => {
  mockFindOneById.mockResolvedValueOnce({
    _id: new ObjectId(),
    id: "1",
    type: ItemType.Single,
    name: "test",
    description: "test",
    price: 10,
    photoUrls: [],
    seller: seller1,
    status: ItemStatus.ForSale,
    createdAt: new Date(),
    deletedAt: null,
  });

  const promise = decompose({ id: "1", user: seller1 });

  expect(promise).rejects.toBeInstanceOf(HTTPException);
  expect(promise).rejects.toHaveProperty("status", 422);
});

it("throws HTTPException 403 if user is not the seller", async () => {
  mockFindOneById.mockResolvedValueOnce({
    _id: new ObjectId(),
    id: "1",
    type: ItemType.Pack,
    name: "test",
    description: "test",
    price: 10,
    discount: 0,
    children: [],
    seller: seller2,
    status: ItemStatus.ForSale,
    createdAt: new Date(),
    deletedAt: null,
  });

  const promise = decompose({ id: "1", user: seller1 });

  expect(promise).rejects.toBeInstanceOf(HTTPException);
  expect(promise).rejects.toHaveProperty("status", 403);
});
