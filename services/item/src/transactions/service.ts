import type { SimplifiedAccount } from "@/types";
import * as transactionsRepository from "./repository";

type GetAllDto = {
  itemId?: string;
  excludeCancelled: boolean;
  user: SimplifiedAccount;
};

export async function getAll(dto: GetAllDto) {
  return await transactionsRepository.find(
    {
      $or: [{ "buyer.id": dto.user.id }, { "seller.id": dto.user.id }],
      ...(dto.itemId ? { "item.id": dto.itemId } : {}),
      ...(dto.excludeCancelled ? { cancelledAt: null } : {}),
    },
    {
      projection: { _id: 0 },
      sort: { _id: -1 },
    },
  );
}
