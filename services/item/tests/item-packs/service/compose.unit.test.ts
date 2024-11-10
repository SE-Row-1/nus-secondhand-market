import * as composite from "@/item-packs/composite";
import { compose } from "@/item-packs/service";
import * as itemsRepository from "@/items/repository";
import { ItemStatus, ItemType } from "@/types";
import { afterAll, afterEach, expect, it, mock, spyOn } from "bun:test";
import { HTTPException } from "hono/http-exception";
import { BulkWriteResult, ObjectId } from "mongodb";
import { seller1, seller2 } from "../../test-utils/data";

const mockFindManyByIds = spyOn(itemsRepository, "findManyByIds");
const mockCompose = spyOn(itemsRepository, "compose");
const mockCalculatePrice = spyOn(composite, "calculatePrice");

afterEach(() => {
  mockFindManyByIds.mockClear();
  mockCompose.mockClear();
  mockCalculatePrice.mockClear();
});

afterAll(() => {
  mock.restore();
});

it("composes pack", async () => {
  mockFindManyByIds.mockResolvedValueOnce([
    {
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
    },
    {
      _id: new ObjectId(),
      id: "2",
      type: ItemType.Single,
      name: "test",
      description: "test",
      price: 10,
      photoUrls: [],
      seller: seller1,
      status: ItemStatus.ForSale,
      createdAt: new Date(),
      deletedAt: null,
    },
  ]);
  mockCalculatePrice.mockReturnValueOnce(1);
  mockCompose.mockResolvedValueOnce({} as BulkWriteResult);

  const pack = await compose({
    name: "test",
    description: "test",
    discount: 0,
    childrenIds: ["1", "2"],
    user: seller1,
  });

  expect(pack).toEqual({
    id: expect.any(String),
    type: ItemType.Pack,
    name: "test",
    description: "test",
    price: 1,
    discount: 0,
    children: expect.arrayContaining([
      expect.objectContaining({ id: "1" }),
      expect.objectContaining({ id: "2" }),
    ]),
    seller: seller1,
    status: ItemStatus.ForSale,
    createdAt: expect.any(Date),
    deletedAt: null,
  });
  expect(mockFindManyByIds).toHaveBeenLastCalledWith(["1", "2"]);
  expect(mockCalculatePrice).toHaveBeenLastCalledWith(
    expect.objectContaining({
      children: expect.arrayContaining([
        expect.objectContaining({ id: "1" }),
        expect.objectContaining({ id: "2" }),
      ]),
    }),
  );
  expect(mockCompose).toHaveBeenLastCalledWith(
    expect.objectContaining({ price: 1 }),
  );
});

it("throws HTTPException 404 if some items do not exist", async () => {
  mockFindManyByIds.mockResolvedValueOnce([
    {
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
    },
  ]);

  const promise = compose({
    name: "test",
    description: "test",
    discount: 0,
    childrenIds: ["1", "2"],
    user: seller1,
  });

  expect(promise).rejects.toBeInstanceOf(HTTPException);
  expect(promise).rejects.toHaveProperty("status", 404);
});

it("throws HTTPException 403 if user tries to compose other user's items", async () => {
  mockFindManyByIds.mockResolvedValueOnce([
    {
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
    },
    {
      _id: new ObjectId(),
      id: "2",
      type: ItemType.Single,
      name: "test",
      description: "test",
      price: 10,
      photoUrls: [],
      seller: seller2,
      status: ItemStatus.ForSale,
      createdAt: new Date(),
      deletedAt: null,
    },
  ]);

  const promise = compose({
    name: "test",
    description: "test",
    discount: 0,
    childrenIds: ["1", "2"],
    user: seller1,
  });

  expect(promise).rejects.toBeInstanceOf(HTTPException);
  expect(promise).rejects.toHaveProperty("status", 403);
});
