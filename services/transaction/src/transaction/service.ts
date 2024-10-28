import { publishTransactionAutoCompletedEvent } from "@/events/publish-transaction-auto-completed-event";
import { publishTransactionCreatedEvent } from "@/events/publish-transaction-created-event";
import {
  ItemStatus,
  type DetailedAccount,
  type DetailedItem,
  type SimplifiedAccount,
} from "@/types";
import { createRequester } from "@/utils/requester";
import { HTTPException } from "hono/http-exception";
import * as transactionsRepository from "./repository";
import { chooseStrategy } from "./update-status-strategies";

type GetAllDto = {
  itemId?: string;
  excludeCancelled: boolean;
  user: SimplifiedAccount;
};

export async function getAll(dto: GetAllDto) {
  return transactionsRepository.selectAll({
    itemId: dto.itemId,
    userId: dto.user.id,
    excludeCancelled: dto.excludeCancelled,
  });
}

type CreateDto = {
  itemId: string;
  buyerId: number;
  user: SimplifiedAccount;
};

export async function create(dto: CreateDto) {
  if (dto.user.id === dto.buyerId) {
    throw new HTTPException(403, { message: "You cannot buy your own item" });
  }

  const [detailedBuyer, detailedItem] = await Promise.all([
    createRequester("account")<DetailedAccount>(`/accounts/${dto.buyerId}`),
    createRequester("item")<DetailedItem>(`/items/${dto.itemId}`),
  ]);

  if (dto.user.id !== detailedItem.seller.id) {
    throw new HTTPException(403, {
      message: "Only seller can create transaction",
    });
  }

  if (detailedItem.status !== ItemStatus.FOR_SALE) {
    throw new HTTPException(400, { message: "Item is not for sale now" });
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
      id: detailedBuyer.id,
      nickname: detailedBuyer.nickname,
      avatarUrl: detailedBuyer.avatarUrl,
    },
  });

  publishTransactionCreatedEvent(transaction);
  publishTransactionAutoCompletedEvent(transaction);

  return transaction;
}

type UpdateDto = {
  id: string;
  action: "complete" | "cancel";
  user: SimplifiedAccount;
};

export async function update(dto: UpdateDto) {
  const transaction = await transactionsRepository.selectOneById(dto.id);

  if (!transaction) {
    throw new HTTPException(404, { message: "Transaction not found" });
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

  const updateStrategy = chooseStrategy(dto.action);
  await updateStrategy(transaction, dto.user);
}
