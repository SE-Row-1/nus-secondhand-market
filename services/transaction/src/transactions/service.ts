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
import { chooseStategy } from "./transition";

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
    throw new HTTPException(403, {
      message: "You cannot specify yourself as buyer",
    });
  }

  const [buyerAccount, detailedItem] = await Promise.all([
    createRequester("account")<Account>(`/accounts/${dto.buyerId}`),
    createRequester("item")<DetailedItem>(`/items/${dto.itemId}`),
  ]);

  if (dto.user.id !== detailedItem.seller.id) {
    throw new HTTPException(403, {
      message: "Only seller can create transaction",
    });
  }

  if (detailedItem.status !== ItemStatus.ForSale) {
    throw new HTTPException(409, { message: "Item is currently not for sale" });
  }

  const latestTransaction =
    await transactionsRepository.selectLatestOneByItemId(dto.itemId);

  const isPending =
    latestTransaction &&
    !latestTransaction.completedAt &&
    !latestTransaction.cancelledAt;

  if (isPending) {
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

type TransitionDto = {
  id: string;
  user: Participant;
  action: "complete" | "cancel";
};

export async function transition(dto: TransitionDto) {
  const transaction = await transactionsRepository.selectOneById(dto.id);

  if (!transaction) {
    throw new HTTPException(404, { message: "Transaction not found" });
  }

  const strategy = chooseStategy(dto.action);
  await strategy(transaction, dto.user);
}
