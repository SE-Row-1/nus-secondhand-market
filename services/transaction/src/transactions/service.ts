import { publishEvent } from "@/events/publish";
import {
  ItemStatus,
  type Account,
  type DetailedItem,
  type Participant,
} from "@/types";
import { createRequester } from "@/utils/requester";
import { HTTPException } from "hono/http-exception";
import * as transactionsRepository from "./repository";
import { chooseStrategy } from "./update-status-strategies";

type GetAllDto = {
  itemId?: string;
  excludeCancelled: boolean;
  user: Participant;
};

export async function getAll(dto: GetAllDto) {
  return transactionsRepository.selectMany({
    itemId: dto.itemId,
    participantId: dto.user.id,
    excludeCancelled: dto.excludeCancelled,
  });
}

type CreateDto = {
  itemId: string;
  buyerId: number;
  user: Participant;
};

export async function create(dto: CreateDto) {
  if (dto.user.id === dto.buyerId) {
    throw new HTTPException(403, { message: "You cannot buy your own item" });
  }

  const [
    { data: buyerAccount, error: buyerAccountError },
    { data: detailedItem, error: detailedItemError },
  ] = await Promise.all([
    createRequester("account")<Account>(`/accounts/${dto.buyerId}`),
    createRequester("item")<DetailedItem>(`/items/${dto.itemId}`),
  ]);

  if (!buyerAccount || buyerAccountError) {
    throw new HTTPException(404, { message: "Buyer not found" });
  }

  if (!detailedItem || detailedItemError) {
    throw new HTTPException(404, { message: "Item not found" });
  }

  if (dto.user.id !== detailedItem.seller.id) {
    throw new HTTPException(403, {
      message: "Only seller can create transaction",
    });
  }

  if (detailedItem.status !== ItemStatus.ForSale) {
    throw new HTTPException(409, { message: "Item is currently not for sale" });
  }

  const pendingTransaction =
    await transactionsRepository.selectLatestOneByItemId(dto.itemId);

  if (pendingTransaction) {
    throw new HTTPException(409, {
      message: "There is already a pending transaction for this item",
    });
  }

  const transaction = await transactionsRepository.insertOne({
    item: {
      id: detailedItem.id,
      name: detailedItem.name,
      price: detailedItem.price,
    },
    seller: {
      id: detailedItem.seller.id,
      nickname: detailedItem.seller.nickname,
      avatarUrl: detailedItem.seller.avatarUrl,
    },
    buyer: {
      id: buyerAccount.id,
      nickname: buyerAccount.nickname,
      avatarUrl: buyerAccount.avatarUrl,
    },
  });

  publishEvent("transaction", "transaction.created", transaction);
  publishEvent("transaction", "transaction.auto-completed", transaction);

  return transaction;
}

type UpdateDto = {
  id: string;
  action: "complete" | "cancel";
  user: Participant;
};

export async function update(dto: UpdateDto) {
  const transaction = await transactionsRepository.selectOneById(dto.id);

  if (!transaction) {
    throw new HTTPException(404, { message: "Transaction not found" });
  }

  const updateStrategy = chooseStrategy(dto.action);
  await updateStrategy(transaction, dto.user);
}
