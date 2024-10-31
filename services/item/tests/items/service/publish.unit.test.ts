import * as itemsRepository from "@/items/repository";
import { publish } from "@/items/service";
import { ItemStatus, ItemType } from "@/types";
import * as photoStorageGateway from "@/utils/photo-storage-gateway";
import { afterAll, afterEach, expect, it, mock, spyOn } from "bun:test";
import { seller1 } from "../../test-utils/data";

const mockSave = mock();
const mockCreatePhotoStorageGateway = spyOn(
  photoStorageGateway,
  "createPhotoStorageGateway",
).mockImplementation(() => ({ save: mockSave, remove: async () => {} }));
const mockInsertOne = spyOn(itemsRepository, "insertOne");

afterEach(() => {
  mockSave.mockClear();
  mockCreatePhotoStorageGateway.mockClear();
  mockInsertOne.mockClear();
});

afterAll(() => {
  mock.restore();
});

it("publishes item", async () => {
  mockSave
    .mockResolvedValueOnce("test1.jpg")
    .mockResolvedValueOnce("test2.jpg");

  const result = await publish({
    name: "test",
    description: "test",
    price: 100,
    photos: [
      new File(["test"], "test1.jpg") as File,
      new File(["test"], "test2.jpg") as File,
    ],
    user: seller1,
  });

  expect(result).toEqual({
    id: expect.any(String),
    type: ItemType.Single,
    name: "test",
    description: "test",
    price: 100,
    photoUrls: ["test1.jpg", "test2.jpg"],
    seller: seller1,
    status: ItemStatus.ForSale,
    createdAt: expect.any(Date),
    deletedAt: null,
  });
  expect(mockSave).toHaveBeenCalledTimes(2);
  expect(mockInsertOne).toHaveBeenCalledWith(result);
});
