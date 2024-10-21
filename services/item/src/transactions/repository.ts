import { type SimplifiedAccount } from "@/types";
import { transactionsCollection } from "@/utils/db";

type CreateTransactionRepositoryDto = {
  buyer: SimplifiedAccount;
  seller: SimplifiedAccount;
  itemId: string;
};

export async function create(dto: CreateTransactionRepositoryDto) {
  await transactionsCollection.insertOne({
    id: crypto.randomUUID(),
    buyer: dto.buyer,
    seller: dto.seller,
    itemId: dto.itemId,
    createdAt: new Date(),
    completedAt: null,
    cancelledAt: null,
  });
}

export async function complete(id: string) {
  await transactionsCollection.updateOne(
    { id },
    {
      $set: {
        completedAt: new Date(),
      },
    },
  );
}

export async function cancel(id: string) {
  await transactionsCollection.updateOne(
    { id },
    {
      $set: {
        cancelledAt: new Date(),
      },
    },
  );
}
