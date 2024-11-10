import { publishEvent } from "@/events/publish";
import type { Participant, Transaction } from "@/types";
import { HTTPException } from "hono/http-exception";
import * as transactionsRepository from "./repository";

export function chooseStategy(action: "complete" | "cancel") {
  switch (action) {
    case "complete":
      return complete;
    case "cancel":
      return cancel;
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
  publishEvent("notification", "batch-email", {
    emails: [
      {
        to: transaction.seller.email,
        title: "Buyer has confirmed the receipt of your second-hand item",
        content: `Dear ${transaction.seller.nickname ?? transaction.seller.email},\n\nThis is to confirm that the buyer of your second-hand item has confirmed the receipt on NUS Second-Hand Market.\n\nTransaction Details:\nItem: ${transaction.item.name}\nPrice: ${transaction.item.price}\nBuyer: ${transaction.buyer.nickname ?? transaction.buyer.email}\n\nThis transaction has now been marked as completed.\nYou could also view your <a href="https://www.nshm.store/transactions">transaction history</a> online at any time.\n\nBest Regards,\nNUS Second-Hand Market`,
      },
      {
        to: transaction.buyer.email,
        title: "You have confirmed the receipt of a second-hand item",
        content: `Dear ${transaction.buyer.nickname ?? transaction.buyer.email},\n\nThis is to confirm that you have confirmed the receipt of a second-hand item you have purchased on NUS Second-Hand Market.\n\nTransaction Details:\nItem: ${transaction.item.name}\nPrice: ${transaction.item.price}\nSeller: ${transaction.seller.nickname ?? transaction.seller.email}\n\nThis transaction has now been marked as completed.\nYou could also view your <a href="https://www.nshm.store/transactions">transaction history</a> online at any time.\n\nBest Regards,\nNUS Second-Hand Market`,
      },
    ],
  });
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
  publishEvent("notification", "batch-email", {
    emails: [
      {
        to: transaction.seller.email,
        title: "You have cancelled a deal on NUS Second-Hand Market",
        content: `Dear ${transaction.seller.nickname ?? transaction.seller.email},\n\nThis is to confirm that you have cancelled a deal on NUS Second-Hand Market.\n\nTransaction Details:\nItem: ${transaction.item.name}\nPrice: ${transaction.item.price}\nBuyer: ${transaction.buyer.nickname ?? transaction.buyer.email}\n\nThe transaction has been aborted, and you could <a href="https://www.nshm.store/items/${transaction.item.id}">make a new deal</a> with someone else.\nYou could also view your <a href="https://www.nshm.store/transactions">transaction history</a> online at any time.\n\nBest Regards,\nNUS Second-Hand Market`,
      },
      {
        to: transaction.buyer.email,
        title:
          "The seller has cancelled the deal with you on NUS Second-Hand Market",
        content: `Dear ${transaction.buyer.nickname ?? transaction.buyer.email},\n\nThis is to confirm that the seller has cancelled the deal with you on NUS Second-Hand Market.\n\nTransaction Details:\nItem: ${transaction.item.name}\nPrice: ${transaction.item.price}\nSeller: ${transaction.seller.nickname ?? transaction.seller.email}\n\nThe transaction has been aborted.\nYou could also view your <a href="https://www.nshm.store/transactions">transaction history</a> online at any time.\n\nBest Regards,\nNUS Second-Hand Market`,
      },
    ],
  });
}
