import * as transactionsRepository from "@/transactions/repository";
import { ItemStatus, type Item, type SimplifiedAccount } from "@/types";
import { HTTPException } from "hono/http-exception";

type Transition = (dto: {
  item: Item;
  actor: SimplifiedAccount;
  counterparty?: SimplifiedAccount;
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

const forSaleToDealt: Transition = async ({ item, actor, counterparty }) => {
  if (actor.id !== item.seller.id) {
    throw new HTTPException(403, {
      message: "You are not the seller of this item",
    });
  }

  if (!counterparty) {
    throw new HTTPException(400, { message: "Counterparty not given" });
  }

  const conflictedTransaction = await transactionsRepository.findOne({
    itemId: item.id,
    cancelledAt: null,
  });

  if (conflictedTransaction) {
    throw new HTTPException(409, { message: "Transaction already exists" });
  }

  await transactionsRepository.create({
    itemId: item.id,
    seller: item.seller,
    buyer: counterparty,
  });
};

const dealtToSold: Transition = async ({ item, actor }) => {
  const transaction = await transactionsRepository.findOne({
    itemId: item.id,
    "buyer.id": actor.id,
  });

  if (!transaction) {
    throw new HTTPException(403, {
      message: "The seller didn't make the deal with you",
    });
  }

  if (transaction.completedAt) {
    throw new HTTPException(409, { message: "Transaction already completed" });
  }

  if (transaction.cancelledAt) {
    throw new HTTPException(409, { message: "Transaction already cancelled" });
  }

  await transactionsRepository.complete(transaction.id);
};

const dealtToForSale: Transition = async ({ item, actor }) => {
  const transaction = await transactionsRepository.findOne({
    itemId: item.id,
    "seller.id": actor.id,
  });

  if (!transaction) {
    throw new HTTPException(403, {
      message: "You didn't make the deal with the buyer",
    });
  }

  if (transaction.completedAt) {
    throw new HTTPException(409, { message: "Transaction already completed" });
  }

  if (transaction.cancelledAt) {
    throw new HTTPException(409, { message: "Transaction already cancelled" });
  }

  await transactionsRepository.cancel(transaction.id);
};
