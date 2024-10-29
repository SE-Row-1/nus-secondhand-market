import * as transactionsRepository from "@/transactions/repository";
import { chooseStrategy } from "@/transactions/update-status-strategies";
import type { Transaction } from "@/types";
import { afterAll, beforeAll, expect, it, mock, spyOn } from "bun:test";
import { HTTPException } from "hono/http-exception";
import { participant1, participant2 } from "../../test-utils/data";

const mockCompleteById = spyOn(
  transactionsRepository,
  "completeById",
).mockImplementation(async () => 1);
const mockPublishEvent = mock();

beforeAll(() => {
  mock.module("@/events/publish", () => ({
    publishEvent: mockPublishEvent,
  }));
});

afterAll(() => {
  mock.restore();
});

const complete = chooseStrategy("complete");

it("calls completeById and publishEvent", async () => {
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

  await complete(transaction, participant2);

  expect(mockCompleteById).toHaveBeenLastCalledWith(transaction.id);
  expect(mockPublishEvent).toHaveBeenLastCalledWith(
    "transaction",
    "transaction.completed",
    transaction,
  );
});

it("throws HTTPException 403 if user is not buyer", async () => {
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

  const fn = async () => await complete(transaction, participant1);

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

  const fn = async () => await complete(transaction, participant2);

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

  const fn = async () => await complete(transaction, participant2);

  expect(fn).toThrow(HTTPException);
  expect(fn).toThrow(expect.objectContaining({ status: 409 }));
});
