import * as publish from "@/events/publish";
import * as transactionsRepository from "@/transactions/repository";
import { create } from "@/transactions/service";
import { ItemStatus } from "@/types";
import * as requester from "@/utils/requester";
import { afterAll, afterEach, expect, it, mock, spyOn } from "bun:test";
import { HTTPException } from "hono/http-exception";
import { account2, participant1, participant2 } from "../../test-utils/data";

const mockInsertOne = spyOn(transactionsRepository, "insertOne");
const mockSelectLatestOneByItemId = spyOn(
  transactionsRepository,
  "selectLatestOneByItemId",
);
const mockAccountRequester = mock();
const mockItemRequester = mock();
const mockRequester = spyOn(requester, "createRequester").mockImplementation(
  (service: string) => {
    if (service === "account") {
      return mockAccountRequester;
    }
    return mockItemRequester;
  },
);
const mockPublishEvent = spyOn(publish, "publishEvent");

afterEach(() => {
  mockInsertOne.mockClear();
  mockSelectLatestOneByItemId.mockClear();
  mockAccountRequester.mockClear();
  mockItemRequester.mockClear();
  mockRequester.mockClear();
  mockPublishEvent.mockClear();
});

afterAll(() => {
  mock.restore();
});

it("creates transaction", async () => {
  const item = {
    id: crypto.randomUUID(),
    name: "test",
    price: 100,
  };
  mockSelectLatestOneByItemId.mockResolvedValueOnce(undefined);
  mockInsertOne.mockResolvedValueOnce({
    id: crypto.randomUUID(),
    item,
    seller: participant1,
    buyer: participant2,
    createdAt: new Date().toISOString(),
    completedAt: null,
    cancelledAt: null,
  });
  mockAccountRequester.mockResolvedValueOnce(account2);
  mockItemRequester.mockResolvedValueOnce({
    ...item,
    seller: participant1,
    status: ItemStatus.ForSale,
  });

  const result = await create({
    itemId: item.id,
    buyerId: participant2.id,
    user: participant1,
  });

  expect(result).toEqual({
    id: expect.any(String),
    item,
    seller: participant1,
    buyer: participant2,
    createdAt: expect.any(String),
    completedAt: null,
    cancelledAt: null,
  });
  expect(mockAccountRequester).toHaveBeenLastCalledWith("/accounts/2");
  expect(mockItemRequester).toHaveBeenLastCalledWith(`/items/${item.id}`);
  expect(mockSelectLatestOneByItemId).toHaveBeenLastCalledWith(item.id);
  expect(mockInsertOne).toHaveBeenLastCalledWith({
    item,
    seller: participant1,
    buyer: participant2,
  });
  expect(mockPublishEvent).toHaveBeenNthCalledWith(
    1,
    "transaction",
    "transaction.created",
    result,
  );
  expect(mockPublishEvent).toHaveBeenNthCalledWith(
    2,
    "transaction",
    "transaction.auto-completed",
    result,
  );
});

it("throws HTTPException 403 if user is buyer", async () => {
  const promise = create({
    itemId: crypto.randomUUID(),
    buyerId: participant1.id,
    user: participant1,
  });

  expect(promise).rejects.toBeInstanceOf(HTTPException);
  expect(promise).rejects.toHaveProperty("status", 403);
});

it("throws HTTPException 404 if buyer is not found", async () => {
  const item = {
    id: crypto.randomUUID(),
    name: "test",
    price: 100,
  };
  mockAccountRequester.mockRejectedValueOnce(new HTTPException(404));
  mockItemRequester.mockResolvedValueOnce({
    ...item,
    seller: participant1,
    status: ItemStatus.ForSale,
  });

  const promise = create({
    itemId: item.id,
    buyerId: participant2.id,
    user: participant1,
  });

  expect(promise).rejects.toBeInstanceOf(HTTPException);
  expect(promise).rejects.toHaveProperty("status", 404);
});

it("throws HTTPException 404 if item is not found", async () => {
  const item = {
    id: crypto.randomUUID(),
    name: "test",
    price: 100,
  };
  mockAccountRequester.mockResolvedValueOnce(account2);
  mockItemRequester.mockRejectedValueOnce(new HTTPException(404));

  const promise = create({
    itemId: item.id,
    buyerId: participant2.id,
    user: participant1,
  });

  expect(promise).rejects.toBeInstanceOf(HTTPException);
  expect(promise).rejects.toHaveProperty("status", 404);
});

it("throws HTTPException 403 if user is not seller", async () => {
  const item = {
    id: crypto.randomUUID(),
    name: "test",
    price: 100,
  };
  mockAccountRequester.mockResolvedValueOnce(account2);
  mockItemRequester.mockResolvedValueOnce({
    ...item,
    seller: participant2,
    status: ItemStatus.ForSale,
  });

  const promise = create({
    itemId: item.id,
    buyerId: participant2.id,
    user: participant1,
  });

  expect(promise).rejects.toBeInstanceOf(HTTPException);
  expect(promise).rejects.toHaveProperty("status", 403);
});

it("throws HTTPException 409 if item is not for sale", async () => {
  const item = {
    id: crypto.randomUUID(),
    name: "test",
    price: 100,
  };
  mockAccountRequester.mockResolvedValueOnce(account2);
  mockItemRequester.mockResolvedValueOnce({
    ...item,
    seller: participant1,
    status: ItemStatus.Sold,
  });

  const promise = create({
    itemId: item.id,
    buyerId: participant2.id,
    user: participant1,
  });

  expect(promise).rejects.toBeInstanceOf(HTTPException);
  expect(promise).rejects.toHaveProperty("status", 409);
});

it("throws HTTPException 409 if there is already a pending transaction", async () => {
  const item = {
    id: crypto.randomUUID(),
    name: "test",
    price: 100,
  };
  mockAccountRequester.mockResolvedValueOnce(account2);
  mockItemRequester.mockResolvedValueOnce({
    ...item,
    seller: participant1,
    status: ItemStatus.ForSale,
  });
  mockSelectLatestOneByItemId.mockResolvedValueOnce({
    id: crypto.randomUUID(),
    item,
    seller: participant1,
    buyer: participant2,
    createdAt: new Date().toISOString(),
    completedAt: null,
    cancelledAt: null,
  });

  const promise = create({
    itemId: item.id,
    buyerId: participant2.id,
    user: participant1,
  });

  expect(promise).rejects.toBeInstanceOf(HTTPException);
  expect(promise).rejects.toHaveProperty("status", 409);
});
