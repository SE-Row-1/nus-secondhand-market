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
  isCancelled?: boolean | undefined;
  user: Participant;
};

export async function getAll(dto: GetAllDto) {
  return transactionsRepository.selectMany({
    itemId: dto.itemId,
    participantId: dto.user.id,
    isCancelled: dto.isCancelled,
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
    throw new HTTPException(409, {
      message: "This item is not for sale at the moment",
    });
  }

  const acknowledgedTransactions = await transactionsRepository.selectMany({
    itemId: dto.itemId,
    isCancelled: false,
  });
  const acknowledgedTransaction = acknowledgedTransactions[0];

  if (acknowledgedTransaction && acknowledgedTransaction.completedAt) {
    throw new HTTPException(409, {
      message: "This item has already been sold",
    });
  }

  if (acknowledgedTransaction) {
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
      id: dto.user.id,
      email: dto.user.email,
      nickname: dto.user.nickname,
      avatarUrl: dto.user.avatarUrl,
    },
    buyer: {
      id: buyerAccount.id,
      email: buyerAccount.email,
      nickname: buyerAccount.nickname,
      avatarUrl: buyerAccount.avatarUrl,
    },
  });

  publishEvent("transaction", "transaction.created", transaction);
  publishEvent("transaction", "transaction.auto-completed", transaction);
  publishEvent("notification", "batch-email", {
    emails: [
      {
        to: dto.user.email,
        title: "You have made a deal on NUS Second-Hand Market",
        content: `Dear ${dto.user.nickname ?? dto.user.email},\n\nThis is to confirm that you have made a deal for your second-hand item on NUS Second-Hand Market.\n\nTransaction Details:\nItem: ${detailedItem.name}\nPrice: ${detailedItem.price}\nBuyer: ${buyerAccount.nickname ?? buyerAccount.email}\n\nPlease proceed to contact the buyer to arrange for the transaction offline.\nYou could also view your <a href="https://www.nshm.store/transactions">transaction history</a> online at any time.\n\nBest Regards,\nNUS Second-Hand Market`,
      },
      {
        to: buyerAccount.email,
        title: "You have secured a deal on NUS Second-Hand Market",
        content: `Dear ${buyerAccount.nickname ?? buyerAccount.email},\n\nThis is to confirm that you have secured a deal for a second-hand item you have listed as wanted on NUS Second-Hand Market.\n\nTransaction Details:\nItem: ${detailedItem.name}\nPrice: ${detailedItem.price}\nSeller: ${dto.user.nickname ?? dto.user.email}\n\nPlease proceed to contact the seller to arrange for the transaction offline.\nYou could also view your <a href="https://www.nshm.store/transactions">transaction history</a> online at any time.\n\nBest Regards,\nNUS Second-Hand Market`,
      },
    ],
  });

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
