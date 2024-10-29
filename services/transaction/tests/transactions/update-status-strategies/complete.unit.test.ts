import { chooseStrategy } from "@/transactions/update-status-strategies";
import type { Transaction } from "@/types";
import { afterAll, beforeAll, expect, it, mock } from "bun:test";
import { HTTPException } from "hono/http-exception";
import { me, someone } from "../../test-utils/mock";

const mockCompleteById = mock();
const mockPublishEvent = mock();

beforeAll(() => {
  mock.module("@/transactions/repository", () => ({
    completeById: mockCompleteById,
  }));

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
    buyer: someone.participant,
    seller: me.participant,
    createdAt: new Date().toISOString(),
    completedAt: null,
    cancelledAt: null,
  };

  await complete(transaction, someone.participant);

  expect(mockCompleteById).toHaveBeenLastCalledWith(transaction.id);
  expect(mockPublishEvent).toHaveBeenLastCalledWith(
    "transaction",
    "transaction.completed",
    transaction,
  );
});

it("throws HTTPException if user is not buyer", async () => {
  const transaction: Transaction = {
    id: crypto.randomUUID(),
    item: {
      id: crypto.randomUUID(),
      name: "test",
      price: 100,
    },
    buyer: someone.participant,
    seller: me.participant,
    createdAt: new Date().toISOString(),
    completedAt: null,
    cancelledAt: null,
  };

  const fn = async () => await complete(transaction, me.participant);

  expect(fn).toThrow(HTTPException);
});

it("throws HTTPException if transaction is already completed", async () => {
  const transaction: Transaction = {
    id: crypto.randomUUID(),
    item: {
      id: crypto.randomUUID(),
      name: "test",
      price: 100,
    },
    buyer: someone.participant,
    seller: me.participant,
    createdAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
    cancelledAt: null,
  };

  const fn = async () => await complete(transaction, someone.participant);

  expect(fn).toThrow(HTTPException);
});

it("throws HTTPException if transaction is already cancelled", async () => {
  const transaction: Transaction = {
    id: crypto.randomUUID(),
    item: {
      id: crypto.randomUUID(),
      name: "test",
      price: 100,
    },
    buyer: someone.participant,
    seller: me.participant,
    createdAt: new Date().toISOString(),
    completedAt: null,
    cancelledAt: new Date().toISOString(),
  };

  const fn = async () => await complete(transaction, someone.participant);

  expect(fn).toThrow(HTTPException);
});
