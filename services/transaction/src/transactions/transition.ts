import { publishEvent } from "@/events/publish";
import type { Participant, Transaction } from "@/types";
import { HTTPException } from "hono/http-exception";
import * as transactionsRepository from "./repository";

export function chooseStategy(action: string) {
  switch (action) {
    case "complete":
      return complete;
    case "cancel":
      return cancel;
    default:
      throw new HTTPException(500, {
        message: `Unsupported action "${action}"`,
      });
  }
}

async function complete(transaction: Transaction, actor: Participant) {
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

  if (actor.id !== transaction.buyer.id) {
    throw new HTTPException(403, {
      message: "Only buyer can complete transaction",
    });
  }

  const newTransaction = await transactionsRepository.completeOneById(
    transaction.id,
  );

  publishEvent("transaction", "transaction.completed", newTransaction);
}

async function cancel(transaction: Transaction, actor: Participant) {
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

  if (actor.id !== transaction.seller.id) {
    throw new HTTPException(403, {
      message: "Only seller can cancel transaction",
    });
  }

  const newTransaction = await transactionsRepository.cancelOneById(
    transaction.id,
  );

  publishEvent("transaction", "transaction.cancelled", newTransaction);
}
