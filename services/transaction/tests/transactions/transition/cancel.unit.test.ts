import * as publish from "@/events/publish";
import * as transactionsRepository from "@/transactions/repository";
import { chooseStategy } from "@/transactions/transition";
import type { Transaction } from "@/types";
import { afterAll, afterEach, expect, it, mock, spyOn } from "bun:test";
import { HTTPException } from "hono/http-exception";
import { participant1, participant2 } from "../../test-utils/data";

const mockCancelOneById = spyOn(transactionsRepository, "cancelOneById");
const mockPublishEvent = spyOn(publish, "publishEvent");

afterEach(() => {
  mockCancelOneById.mockClear();
  mockPublishEvent.mockClear();
});

afterAll(() => {
  mock.restore();
});

const cancel = chooseStategy("cancel");

it("cancels transaction", async () => {
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
  const newTransaction = {
    ...transaction,
    cancelledAt: new Date().toISOString(),
  };
  mockCancelOneById.mockResolvedValueOnce(newTransaction);

  await cancel(transaction, participant1);

  expect(mockCancelOneById).toHaveBeenLastCalledWith(transaction.id);
  expect(mockPublishEvent).toHaveBeenNthCalledWith(
    1,
    "transaction",
    "transaction.cancelled",
    newTransaction,
  );
  expect(mockPublishEvent).toHaveBeenNthCalledWith(
    2,
    "notification",
    "batch-email",
    {
      emails: [
        {
          to: transaction.seller.email,
          title: expect.any(String),
          content: expect.stringContaining(
            transaction.seller.nickname ?? transaction.seller.email,
          ),
        },
        {
          to: transaction.buyer.email,
          title: expect.any(String),
          content: expect.stringContaining(
            transaction.buyer.nickname ?? transaction.buyer.email,
          ),
        },
      ],
    },
  );
});

it("throws HTTPException 409 if transaction is already completed", async () => {
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
    completedAt: new Date().toISOString(),
    cancelledAt: null,
  };

  const promise = cancel(transaction, participant1);

  expect(promise).rejects.toBeInstanceOf(HTTPException);
  expect(promise).rejects.toHaveProperty("status", 409);
});

it("throws HTTPException 409 if transaction is already cancelled", async () => {
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
    cancelledAt: new Date().toISOString(),
  };

  const promise = cancel(transaction, participant1);

  expect(promise).rejects.toBeInstanceOf(HTTPException);
  expect(promise).rejects.toHaveProperty("status", 409);
});

it("throws HTTPException 403 if user is not seller", async () => {
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

  const promise = cancel(transaction, participant2);

  expect(promise).rejects.toBeInstanceOf(HTTPException);
  expect(promise).rejects.toHaveProperty("status", 403);
});
