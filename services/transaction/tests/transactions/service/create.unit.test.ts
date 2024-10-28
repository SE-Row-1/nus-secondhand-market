import { create } from "@/transactions/service";
import { ItemStatus } from "@/types";
import { afterAll, beforeAll, expect, it, mock } from "bun:test";
import { HTTPException } from "hono/http-exception";
import { me, someone } from "../../test-utils/mock";

const mockInsertOne = mock();
const mockSelectLatestOneByItemId = mock();
const mockAccountRequester = mock();
const mockItemRequester = mock();
const mockPublishEvent = mock();

beforeAll(() => {
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

afterAll(() => {
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
    seller: me.participant,
    buyer: someone.participant,
    createdAt: new Date().toISOString(),
    completedAt: null,
    cancelledAt: null,
  });
  mockAccountRequester.mockResolvedValue({
    data: someone.account,
    error: null,
  });
  mockItemRequester.mockResolvedValue({
    data: {
      ...item,
      seller: me.participant,
      status: ItemStatus.FOR_SALE,
    },
    error: null,
  });

  const result = await create({
    itemId: item.id,
    buyerId: someone.participant.id,
    user: me.participant,
  });

  expect(result).toEqual({
    id: expect.any(String),
    item,
    seller: me.participant,
    buyer: someone.participant,
    createdAt: expect.any(String),
    completedAt: null,
    cancelledAt: null,
  });
  expect(mockPublishEvent).toHaveBeenCalledTimes(2);
});

it("throws HTTPException if user is buyer", async () => {
  const fn = async () =>
    await create({
      itemId: crypto.randomUUID(),
      buyerId: me.participant.id,
      user: me.participant,
    });

  expect(fn).toThrow(HTTPException);
});

it("throws HTTPException if buyer is not found", async () => {
  const item = {
    id: crypto.randomUUID(),
    name: "test",
    price: 100,
  };
  mockAccountRequester.mockResolvedValueOnce({
    data: null,
    error: new HTTPException(404),
  });
  mockItemRequester.mockResolvedValue({
    data: {
      ...item,
      seller: me.participant,
      status: ItemStatus.FOR_SALE,
    },
    error: null,
  });

  const fn = async () =>
    await create({
      itemId: item.id,
      buyerId: someone.participant.id,
      user: me.participant,
    });

  expect(fn).toThrow(HTTPException);
});

it("throws HTTPException if item is not found", async () => {
  const item = {
    id: crypto.randomUUID(),
    name: "test",
    price: 100,
  };
  mockAccountRequester.mockResolvedValue({
    data: someone.account,
    error: null,
  });
  mockItemRequester.mockResolvedValueOnce({
    data: null,
    error: new HTTPException(404),
  });

  const fn = async () =>
    await create({
      itemId: item.id,
      buyerId: someone.participant.id,
      user: me.participant,
    });

  expect(fn).toThrow(HTTPException);
});

it("throws HTTPException if user is not seller", async () => {
  const item = {
    id: crypto.randomUUID(),
    name: "test",
    price: 100,
  };
  mockAccountRequester.mockResolvedValue({
    data: me.account,
    error: null,
  });
  mockItemRequester.mockResolvedValue({
    data: {
      ...item,
      seller: me.participant,
      status: ItemStatus.FOR_SALE,
    },
    error: null,
  });

  const fn = async () =>
    await create({
      itemId: item.id,
      buyerId: someone.participant.id,
      user: someone.participant,
    });

  expect(fn).toThrow(HTTPException);
});

it("throws HTTPException if item is not for sale", async () => {
  const item = {
    id: crypto.randomUUID(),
    name: "test",
    price: 100,
  };
  mockAccountRequester.mockResolvedValue({
    data: someone.account,
    error: null,
  });
  mockItemRequester.mockResolvedValue({
    data: {
      ...item,
      seller: me.participant,
      status: ItemStatus.SOLD,
    },
    error: null,
  });

  const fn = async () =>
    await create({
      itemId: item.id,
      buyerId: someone.participant.id,
      user: me.participant,
    });

  expect(fn).toThrow(HTTPException);
});

it("throws HTTPException if there is already a pending transaction", async () => {
  const item = {
    id: crypto.randomUUID(),
    name: "test",
    price: 100,
  };
  mockAccountRequester.mockResolvedValue({
    data: someone.account,
    error: null,
  });
  mockItemRequester.mockResolvedValue({
    data: {
      ...item,
      seller: me.participant,
      status: ItemStatus.FOR_SALE,
    },
    error: null,
  });
  mockSelectLatestOneByItemId.mockResolvedValueOnce({
    id: crypto.randomUUID(),
    item,
    seller: me.participant,
    buyer: someone.participant,
    createdAt: new Date().toISOString(),
    completedAt: null,
    cancelledAt: null,
  });

  const fn = async () =>
    await create({
      itemId: item.id,
      buyerId: someone.participant.id,
      user: me.participant,
    });

  expect(fn).toThrow(HTTPException);
});
