import { publishTransactionAutoCompletedEvent } from "@/events/publish-transaction-auto-completed-event";
import * as transactionsRepository from "@/transactions/repository";
import { ItemStatus, type Item, type Seller } from "@/types";
import { HTTPException } from "hono/http-exception";

type Transition = (dto: {
  item: Item;
  actor: Seller;
  buyer?: Seller;
}) => Promise<void>;

export function createTransition(from: ItemStatus, to: ItemStatus) {
  if (from === ItemStatus.ForSale && to === ItemStatus.Dealt) {
    return forSaleToDealt;
  }

  if (from === ItemStatus.Dealt && to === ItemStatus.Sold) {
    return dealtToSold;
  }

  if (from === ItemStatus.Dealt && to === ItemStatus.ForSale) {
    return dealtToForSale;
  }

  throw new HTTPException(400, {
    message: `Invalid transition from ${from} to ${to}`,
  });
}

const forSaleToDealt: Transition = async ({ item, actor, buyer }) => {
  if (actor.id !== item.seller.id) {
    throw new HTTPException(403, {
      message: "You are not the seller of this item",
    });
  }

  if (!buyer) {
    throw new HTTPException(400, { message: "Buyer not given" });
  }

  const conflictedTransaction = await transactionsRepository.findOne({
    "item.id": item.id,
    cancelledAt: null,
  });

  if (conflictedTransaction) {
    throw new HTTPException(409, { message: "Transaction already exists" });
  }

  const transactionId = await transactionsRepository.create({
    item: {
      id: item.id,
      name: item.name,
      price: item.price,
    },
    seller: item.seller,
    buyer: buyer,
  });

  publishTransactionAutoCompletedEvent(transactionId);
};

const dealtToSold: Transition = async ({ item, actor }) => {
  const transaction = await transactionsRepository.findOne({
    "item.id": item.id,
    "buyer.id": actor.id,
    cancelledAt: null,
  });

  if (!transaction) {
    throw new HTTPException(403, {
      message: "The seller didn't make the deal with you",
    });
  }

  if (transaction.completedAt) {
    throw new HTTPException(409, { message: "Transaction already completed" });
  }

  await transactionsRepository.complete(transaction.id);
};

const dealtToForSale: Transition = async ({ item, actor }) => {
  const transaction = await transactionsRepository.findOne({
    "item.id": item.id,
    "seller.id": actor.id,
    cancelledAt: null,
  });

  if (!transaction) {
    throw new HTTPException(403, {
      message: "You didn't make the deal with the buyer",
    });
  }

  if (transaction.completedAt) {
    throw new HTTPException(409, { message: "Transaction already completed" });
  }

  await transactionsRepository.cancel(transaction.id);
};
