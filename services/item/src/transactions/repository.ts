import { type Transaction } from "@/types";
import { transactionsCollection } from "@/utils/db";
import type { Filter, FindOptions } from "mongodb";

export async function find(filter: Filter<Transaction>, options?: FindOptions) {
  return transactionsCollection.find(filter, options).toArray();
}

export async function findOne(filter: Filter<Transaction>) {
  return transactionsCollection.findOne(filter);
}

type CreateDto = Pick<Transaction, "seller" | "buyer" | "item">;

export async function create(dto: CreateDto) {
  await transactionsCollection.insertOne({
    id: crypto.randomUUID(),
    buyer: dto.buyer,
    seller: dto.seller,
    item: dto.item,
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
