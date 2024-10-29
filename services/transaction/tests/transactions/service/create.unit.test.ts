import { create } from "@/transactions/service";
import { ItemStatus } from "@/types";
import { afterEach, beforeEach, expect, it, mock } from "bun:test";
import { HTTPException } from "hono/http-exception";
import {
  account1,
  account2,
  participant1,
  participant2,
} from "../../test-utils/data";

const mockInsertOne = mock();
const mockSelectLatestOneByItemId = mock();
const mockAccountRequester = mock();
const mockItemRequester = mock();
const mockPublishEvent = mock();

beforeEach(() => {
  mock.module("@/transactions/repository", () => ({
    selectLatestOneByItemId: mockSelectLatestOneByItemId,
    insertOne: mockInsertOne,
  }));

  mock.module("@/utils/requester", () => ({
    createRequester: (service: string) => {
      if (service === "account") {
        return mockAccountRequester;
      }
      return mockItemRequester;
    },
  }));

  mock.module("@/events/publish", () => ({
    publishEvent: mockPublishEvent,
  }));
});

afterEach(() => {
  mock.restore();
});

it("creates a transaction", async () => {
  const item = {
    id: crypto.randomUUID(),
    name: "test",
    price: 100,
  };
  mockInsertOne.mockResolvedValueOnce({
    id: crypto.randomUUID(),
    item,
    seller: participant1,
    buyer: participant2,
    createdAt: new Date().toISOString(),
    completedAt: null,
    cancelledAt: null,
  });
  mockAccountRequester.mockResolvedValue({
    data: account2,
    error: null,
  });
  mockItemRequester.mockResolvedValue({
    data: {
      ...item,
      seller: participant1,
      status: ItemStatus.FOR_SALE,
    },
    error: null,
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
  expect(mockPublishEvent).toHaveBeenCalledTimes(2);
});

it("throws HTTPException 403 if user is buyer", async () => {
  const fn = async () =>
    await create({
      itemId: crypto.randomUUID(),
      buyerId: participant1.id,
      user: participant1,
    });

  expect(fn).toThrow(HTTPException);
  expect(fn).toThrowError(expect.objectContaining({ status: 403 }));
});

it("throws HTTPException 404 if buyer is not found", async () => {
  const item = {
    id: crypto.randomUUID(),
    name: "test",
    price: 100,
  };
  mockAccountRequester.mockResolvedValue({
    data: null,
    error: new HTTPException(404),
  });
  mockItemRequester.mockResolvedValue({
    data: {
      ...item,
      seller: participant1,
      status: ItemStatus.FOR_SALE,
    },
    error: null,
  });

  const fn = async () =>
    await create({
      itemId: item.id,
      buyerId: participant2.id,
      user: participant1,
    });

  expect(fn).toThrow(HTTPException);
  expect(fn).toThrowError(expect.objectContaining({ status: 404 }));
});

it("throws HTTPException 404 if item is not found", async () => {
  const item = {
    id: crypto.randomUUID(),
    name: "test",
    price: 100,
  };
  mockAccountRequester.mockResolvedValue({
    data: account2,
    error: null,
  });
  mockItemRequester.mockResolvedValue({
    data: null,
    error: new HTTPException(404),
  });

  const fn = async () =>
    await create({
      itemId: item.id,
      buyerId: participant2.id,
      user: participant1,
    });

  expect(fn).toThrow(HTTPException);
  expect(fn).toThrowError(expect.objectContaining({ status: 404 }));
});

it("throws HTTPException 403 if user is not seller", async () => {
  const item = {
    id: crypto.randomUUID(),
    name: "test",
    price: 100,
  };
  mockAccountRequester.mockResolvedValue({
    data: account1,
    error: null,
  });
  mockItemRequester.mockResolvedValue({
    data: {
      ...item,
      seller: participant1,
      status: ItemStatus.FOR_SALE,
    },
    error: null,
  });

  const fn = async () =>
    await create({
      itemId: item.id,
      buyerId: participant2.id,
      user: participant2,
    });

  expect(fn).toThrow(HTTPException);
  expect(fn).toThrowError(expect.objectContaining({ status: 403 }));
});

it("throws HTTPException 409 if item is not for sale", async () => {
  const item = {
    id: crypto.randomUUID(),
    name: "test",
    price: 100,
  };
  mockAccountRequester.mockResolvedValue({
    data: account2,
    error: null,
  });
  mockItemRequester.mockResolvedValue({
    data: {
      ...item,
      seller: participant1,
      status: ItemStatus.SOLD,
    },
    error: null,
  });

  const fn = async () =>
    await create({
      itemId: item.id,
      buyerId: participant2.id,
      user: participant1,
    });

  expect(fn).toThrow(HTTPException);
  expect(fn).toThrowError(expect.objectContaining({ status: 409 }));
});

it("throws HTTPException 409 if there is already a pending transaction", async () => {
  const item = {
    id: crypto.randomUUID(),
    name: "test",
    price: 100,
  };
  mockAccountRequester.mockResolvedValue({
    data: account2,
    error: null,
  });
  mockItemRequester.mockResolvedValue({
    data: {
      ...item,
      seller: participant1,
      status: ItemStatus.FOR_SALE,
    },
    error: null,
  });
  mockSelectLatestOneByItemId.mockResolvedValue({
    id: crypto.randomUUID(),
    item,
    seller: participant1,
    buyer: participant2,
    createdAt: new Date().toISOString(),
    completedAt: null,
    cancelledAt: null,
  });

  const fn = async () =>
    await create({
      itemId: item.id,
      buyerId: participant2.id,
      user: participant1,
    });

  expect(fn).toThrow(HTTPException);
  expect(fn).toThrowError(expect.objectContaining({ status: 409 }));
});
