import * as publish from "@/events/publish";
import * as itemsRepository from "@/items/repository";
import { update } from "@/items/service";
import { ItemStatus, ItemType, type Item } from "@/types";
import * as photoStorageGateway from "@/utils/photo-storage-gateway";
import { afterAll, afterEach, expect, it, mock, spyOn } from "bun:test";
import { HTTPException } from "hono/http-exception";
import type { WithId } from "mongodb";
import { seller1, seller2 } from "../../test-utils/data";

const mockFindOneById = spyOn(itemsRepository, "findOneById");
const mockUpdateOneById = spyOn(itemsRepository, "updateOneById");
const mockSave = mock();
const mockRemove = mock();
const mockCreatePhotoStorageGateway = spyOn(
  photoStorageGateway,
  "createPhotoStorageGateway",
).mockImplementation(() => ({ save: mockSave, remove: mockRemove }));
const mockPublishEvent = spyOn(publish, "publishEvent");

afterEach(() => {
  mockFindOneById.mockClear();
  mockUpdateOneById.mockClear();
  mockSave.mockClear();
  mockRemove.mockClear();
  mockCreatePhotoStorageGateway.mockClear();
  mockPublishEvent.mockClear();
});

afterAll(() => {
  mock.restore();
});

it("updates item", async () => {
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
  const newItem = { ...item, name: "update", photoUrls: ["test2.jpg"] };
  mockFindOneById.mockResolvedValueOnce(item as WithId<Item>);
  mockUpdateOneById.mockResolvedValueOnce(newItem as WithId<Item>);
  mockSave.mockResolvedValueOnce("test2.jpg");
  mockRemove.mockResolvedValueOnce(void 0);

  const result = await update({
    id: item.id,
    name: "update",
    addedPhotos: [new File(["test"], "photo2") as File],
    removedPhotoUrls: ["test1.jpg"],
    user: seller1,
  });

  expect(result).toEqual(newItem as never);
  expect(mockFindOneById).toHaveBeenLastCalledWith(item.id);
  expect(mockUpdateOneById).toHaveBeenLastCalledWith(item.id, {
    name: "update",
    photoUrls: ["test2.jpg"],
  });
  expect(mockSave).toHaveBeenCalledTimes(1);
  expect(mockRemove).toHaveBeenCalledTimes(1);
  expect(mockPublishEvent).toHaveBeenLastCalledWith(
    "item",
    "item.updated",
    newItem,
  );
});

it("throws HTTPException 404 if item not found", async () => {
  mockFindOneById.mockResolvedValueOnce(null);

  const promise = update({
    id: crypto.randomUUID(),
    name: "update",
    addedPhotos: [],
    removedPhotoUrls: [],
    user: seller1,
  });

  expect(promise).rejects.toBeInstanceOf(HTTPException);
  expect(promise).rejects.toHaveProperty("status", 404);
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

  const promise = update({
    id: item.id,
    name: "update",
    addedPhotos: [],
    removedPhotoUrls: [],
    user: seller1,
  });

  expect(promise).rejects.toBeInstanceOf(HTTPException);
  expect(promise).rejects.toHaveProperty("status", 403);
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

  const promise = update({
    id: item.id,
    name: "update",
    addedPhotos: [],
    removedPhotoUrls: [],
    user: seller1,
  });

  expect(promise).rejects.toBeInstanceOf(HTTPException);
  expect(promise).rejects.toHaveProperty("status", 422);
});

it("throws HTTPException 400 if more than 5 photos", async () => {
  const item: Item = {
    id: crypto.randomUUID(),
    type: ItemType.Single,
    name: "test",
    description: "test",
    price: 100,
    photoUrls: ["test1.jpg", "test2.jpg", "test3.jpg", "test4.jpg"],
    seller: seller1,
    status: ItemStatus.ForSale,
    createdAt: new Date(),
    deletedAt: null,
  };
  mockFindOneById.mockResolvedValueOnce(item as WithId<Item>);

  const promise = update({
    id: item.id,
    name: "update",
    addedPhotos: [
      new File(["test"], "test5.jpg") as File,
      new File(["test"], "test6.jpg") as File,
    ],
    removedPhotoUrls: [],
    user: seller1,
  });

  expect(promise).rejects.toBeInstanceOf(HTTPException);
  expect(promise).rejects.toHaveProperty("status", 400);
});

it("throws HTTPException 400 if photo to remove not found", async () => {
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

  const promise = update({
    id: item.id,
    name: "update",
    addedPhotos: [],
    removedPhotoUrls: ["test2.jpg"],
    user: seller1,
  });

  expect(promise).rejects.toBeInstanceOf(HTTPException);
  expect(promise).rejects.toHaveProperty("status", 400);
});
