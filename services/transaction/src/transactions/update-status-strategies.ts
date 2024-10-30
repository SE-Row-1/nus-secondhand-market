import { publishEvent } from "@/events/publish";
import type { Participant, Transaction } from "@/types";
import { HTTPException } from "hono/http-exception";
import * as transactionsRepository from "./repository";

type Stragety = (transaction: Transaction, actor: Participant) => Promise<void>;

export const chooseStrategy = (action: "complete" | "cancel"): Stragety => {
  if (action === "complete") {
    return complete;
  }

  return cancel;
};

const complete: Stragety = async (transaction, user) => {
  if (user.id !== transaction.buyer.id) {
    throw new HTTPException(403, {
      message: "Only buyer can complete transaction",
    });
  }

  if (transaction.completedAt) {
    throw new HTTPException(409, {
      message: "Transaction is already completed",
    });
  }

  if (transaction.cancelledAt) {
    throw new HTTPException(409, {
      message: "Transaction is already cancelled",
    });
  }

  const newTransaction = await transactionsRepository.completeOneById(
    transaction.id,
  );

  publishEvent("transaction", "transaction.completed", newTransaction);
};

const cancel: Stragety = async (transaction, user) => {
  if (user.id !== transaction.seller.id) {
    throw new HTTPException(403, {
      message: "Only seller can cancel transaction",
    });
  }

  if (transaction.completedAt) {
    throw new HTTPException(409, {
      message: "Transaction is already completed",
    });
  }

  if (transaction.cancelledAt) {
    throw new HTTPException(409, {
      message: "Transaction is already cancelled",
    });
  }

  const newTransaction = await transactionsRepository.cancelOneById(
    transaction.id,
  );

  publishEvent("transaction", "transaction.cancelled", newTransaction);
};
