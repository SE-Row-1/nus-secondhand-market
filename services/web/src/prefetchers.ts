import type {
  DetailedAccount,
  Item,
  PaginatedItems,
  Transaction,
  WishlistEntry,
  WishlistStatistics,
} from "@/types";
import { serverRequester } from "@/utils/requester/server";
import { cache } from "react";

export const prefetchMe = cache(async () => {
  return await serverRequester.get<DetailedAccount>("/auth/me");
});

export const prefetchItem = cache(async (id: string) => {
  return await serverRequester.get<Item<DetailedAccount>>(`/items/${id}`);
});

export const prefetchMarketplace = cache(async () => {
  return await serverRequester.get<PaginatedItems>("/items?status=0&limit=10");
});

export const prefetchBelongings = cache(async (userId: number) => {
  return await serverRequester.get<PaginatedItems>(
    `/items?seller_id=${userId}&limit=10`,
  );
});

export const prefetchWishlist = cache(async (userId: number) => {
  return await serverRequester.get<PaginatedItems>(
    `/wishlists/${userId}?limit=10`,
  );
});

export const prefetchWishlistItem = cache(
  async (userId: number, itemId: string) => {
    return await serverRequester.get<WishlistEntry>(
      `/wishlists/${userId}/items/${itemId}`,
    );
  },
);

export const prefetchWishlistStatistics = cache(async (itemId: string) => {
  return await serverRequester.get<WishlistStatistics>(
    `/wishlists/statistics/${itemId}`,
  );
});

export const prefetchTransactions = cache(async () => {
  return await serverRequester.get<Transaction[]>("/transactions");
});

export const prefetchItemTransaction = cache(async (itemId: string) => {
  return await serverRequester.get<Transaction[]>(
    `/transactions?item_id=${itemId}&exclude_cancelled=true`,
  );
});
