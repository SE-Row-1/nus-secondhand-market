import * as publish from "@/events/publish";
import * as transactionsRepository from "@/transactions/repository";
import { create } from "@/transactions/service";
import { ItemStatus, type Transaction } from "@/types";
import * as requester from "@/utils/requester";
import { afterAll, afterEach, expect, it, mock, spyOn } from "bun:test";
import { HTTPException } from "hono/http-exception";
import { account2, participant1, participant2 } from "../../test-utils/data";

const mockAccountRequester = mock();
const mockItemRequester = mock();
const mockCreateRequester = spyOn(
  requester,
  "createRequester",
).mockImplementation((service: string) => {
  if (service === "account") {
    return mockAccountRequester;
  }
  return mockItemRequester;
});
const mockSelectMany = spyOn(transactionsRepository, "selectMany");
const mockInsertOne = spyOn(transactionsRepository, "insertOne");
const mockPublishEvent = spyOn(publish, "publishEvent");

afterEach(() => {
  mockAccountRequester.mockClear();
  mockItemRequester.mockClear();
  mockCreateRequester.mockClear();
  mockSelectMany.mockClear();
  mockInsertOne.mockClear();
  mockPublishEvent.mockClear();
});

afterAll(() => {
  mock.restore();
});

it("creates transaction", async () => {
  const transaction: Transaction = {
    id: crypto.randomUUID(),
    item: {
      id: crypto.randomUUID(),
      name: "test",
      price: 100,
    },
    seller: participant1,
    buyer: participant2,
    createdAt: new Date().toISOString(),
    completedAt: null,
    cancelledAt: null,
  };
  mockAccountRequester.mockResolvedValueOnce(account2);
  mockItemRequester.mockResolvedValueOnce({
    ...transaction.item,
    seller: participant1,
    status: ItemStatus.ForSale,
  });
  mockSelectMany.mockResolvedValueOnce([]);
  mockInsertOne.mockResolvedValueOnce(transaction);

  const result = await create({
    itemId: transaction.item.id,
    buyerId: participant2.id,
    user: participant1,
  });

  expect(result).toEqual(transaction);
  expect(mockAccountRequester).toHaveBeenLastCalledWith(
    `/accounts/${participant2.id}`,
  );
  expect(mockItemRequester).toHaveBeenLastCalledWith(
    `/items/${transaction.item.id}`,
  );
  expect(mockSelectMany).toHaveBeenLastCalledWith({
    itemId: transaction.item.id,
    isCancelled: false,
  });
  expect(mockInsertOne).toHaveBeenLastCalledWith({
    item: transaction.item,
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
    seller: participant1,
    status: ItemStatus.ForSale,
  });

  const promise = create({
    itemId: item.id,
    buyerId: participant1.id,
    user: participant2,
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

it("throws HTTPException 409 if there is already a completed transaction", async () => {
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
  mockSelectMany.mockResolvedValueOnce([
    {
      id: crypto.randomUUID(),
      item,
      seller: participant1,
      buyer: participant2,
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      cancelledAt: null,
    },
  ]);

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
  mockSelectMany.mockResolvedValueOnce([
    {
      id: crypto.randomUUID(),
      item,
      seller: participant1,
      buyer: participant2,
      createdAt: new Date().toISOString(),
      completedAt: null,
      cancelledAt: null,
    },
  ]);

  const promise = create({
    itemId: item.id,
    buyerId: participant2.id,
    user: participant1,
  });

  expect(promise).rejects.toBeInstanceOf(HTTPException);
  expect(promise).rejects.toHaveProperty("status", 409);
});
