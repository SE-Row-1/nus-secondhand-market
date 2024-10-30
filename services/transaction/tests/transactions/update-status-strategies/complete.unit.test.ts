import * as publish from "@/events/publish";
import * as transactionsRepository from "@/transactions/repository";
import { chooseStrategy } from "@/transactions/update-status-strategies";
import type { Transaction } from "@/types";
import { afterAll, afterEach, expect, it, mock, spyOn } from "bun:test";
import { HTTPException } from "hono/http-exception";
import { participant1, participant2 } from "../../test-utils/data";

const mockCompleteById = spyOn(transactionsRepository, "completeById");
const mockPublishEvent = spyOn(publish, "publishEvent");

afterEach(() => {
  mockCompleteById.mockClear();
  mockPublishEvent.mockClear();
});

afterAll(() => {
  mock.restore();
});

const complete = chooseStrategy("complete");

it("completes transaction", async () => {
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
    seller: participant1,
    buyer: participant2,
    createdAt: new Date().toISOString(),
    completedAt: null,
    cancelledAt: null,
  };

  const promise = complete(transaction, participant1);

  expect(promise).rejects.toBeInstanceOf(HTTPException);
  expect(promise).rejects.toEqual(expect.objectContaining({ status: 403 }));
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

  const promise = complete(transaction, participant2);

  expect(promise).rejects.toBeInstanceOf(HTTPException);
  expect(promise).rejects.toEqual(expect.objectContaining({ status: 409 }));
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

  const promise = complete(transaction, participant2);

  expect(promise).rejects.toBeInstanceOf(HTTPException);
  expect(promise).rejects.toEqual(expect.objectContaining({ status: 409 }));
});
