import { publishTransactionCancelledEvent } from "@/events/publish-transaction-cancelled-event";
import { publishTransactionCompletedEvent } from "@/events/publish-transaction-completed-event";
import type { SimplifiedAccount, Transaction } from "@/types";
import { HTTPException } from "hono/http-exception";
import * as transactionsRepository from "./repository";

type Stragety = (
  transaction: Transaction,
  actor: SimplifiedAccount,
) => Promise<void>;

export const chooseStrategy = (action: "complete" | "cancel"): Stragety => {
  if (action === "complete") {
    return complete;
  }

  return cancel;
};

const complete: Stragety = async (transaction, actor) => {
  if (actor.id !== transaction.buyer.id) {
    throw new HTTPException(403, {
      message: "Only buyer can complete transaction",
    });
  }

  await transactionsRepository.completeById(transaction.id);

  publishTransactionCompletedEvent(transaction);
};

const cancel: Stragety = async (transaction, actor) => {
  if (actor.id !== transaction.seller.id) {
    throw new HTTPException(403, {
      message: "Only seller can cancel transaction",
    });
  }

  await transactionsRepository.cancelById(transaction.id);

  publishTransactionCancelledEvent(transaction);
};
