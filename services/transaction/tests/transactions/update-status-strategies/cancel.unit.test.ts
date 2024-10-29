import * as transactionsRepository from "@/transactions/repository";
import { chooseStrategy } from "@/transactions/update-status-strategies";
import type { Transaction } from "@/types";
import { afterEach, beforeEach, expect, it, mock, spyOn } from "bun:test";
import { HTTPException } from "hono/http-exception";
import { participant1, participant2 } from "../../test-utils/data";

const mockCancelById = spyOn(
  transactionsRepository,
  "cancelById",
).mockImplementation(async () => 1);
const mockPublishEvent = mock();

beforeEach(() => {
  mock.module("@/events/publish", () => ({
    publishEvent: mockPublishEvent,
  }));
});

afterEach(() => {
  mock.restore();
});

const cancel = chooseStrategy("cancel");

it("calls cancelById and publishEvent", async () => {
  const transaction: Transaction = {
    id: crypto.randomUUID(),
    item: {
      id: crypto.randomUUID(),
      name: "test",
      price: 100,
    },
    buyer: participant2,
    seller: participant1,
    createdAt: new Date().toISOString(),
    completedAt: null,
    cancelledAt: null,
  };

  await cancel(transaction, participant1);

  expect(mockCancelById).toHaveBeenLastCalledWith(transaction.id);
  expect(mockPublishEvent).toHaveBeenLastCalledWith(
    "transaction",
    "transaction.cancelled",
    transaction,
  );
});

it("throws HTTPException 403 if user is not seller", async () => {
  const transaction: Transaction = {
    id: crypto.randomUUID(),
    item: {
      id: crypto.randomUUID(),
      name: "test",
      price: 100,
    },
    buyer: participant2,
    seller: participant1,
    createdAt: new Date().toISOString(),
    completedAt: null,
    cancelledAt: null,
  };

  const fn = async () => await cancel(transaction, participant2);

  expect(fn).toThrow(HTTPException);
  expect(fn).toThrow(expect.objectContaining({ status: 403 }));
});

it("throws HTTPException 409 if transaction is already completed", async () => {
  const transaction: Transaction = {
    id: crypto.randomUUID(),
    item: {
      id: crypto.randomUUID(),
      name: "test",
      price: 100,
    },
    buyer: participant2,
    seller: participant1,
    createdAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
    cancelledAt: null,
  };

  const fn = async () => await cancel(transaction, participant1);

  expect(fn).toThrow(HTTPException);
  expect(fn).toThrow(expect.objectContaining({ status: 409 }));
});

it("throws HTTPException 409 if transaction is already cancelled", async () => {
  const transaction: Transaction = {
    id: crypto.randomUUID(),
    item: {
      id: crypto.randomUUID(),
      name: "test",
      price: 100,
    },
    buyer: participant2,
    seller: participant1,
    createdAt: new Date().toISOString(),
    completedAt: null,
    cancelledAt: new Date().toISOString(),
  };

  const fn = async () => await cancel(transaction, participant1);

  expect(fn).toThrow(HTTPException);
  expect(fn).toThrow(expect.objectContaining({ status: 409 }));
});
