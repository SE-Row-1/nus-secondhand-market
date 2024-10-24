import {
  ItemStatus,
  type DetailedAccount,
  type Item,
  type PaginatedItems,
  type Transaction,
  type WishlistEntry,
  type WishlistStatistics,
} from "@/types";
import { dehydrate, type QueryKey } from "@tanstack/react-query";
import { getQueryClient } from "./client";
import { serverRequester } from "./requester/server";

class Prefetcher {
  private queryClient = getQueryClient();

  public getData<T>(queryKey: QueryKey) {
    return this.queryClient.getQueryData<T>(queryKey);
  }

  public dehydrate() {
    return dehydrate(this.queryClient);
  }

  public async prefetchMe() {
    await this.queryClient.prefetchQuery({
      queryKey: ["auth", "me"],
      queryFn: async () => {
        return await serverRequester.get<DetailedAccount>("/auth/me");
      },
    });
  }

  public async prefetchItem(itemId: string) {
    await this.queryClient.prefetchQuery({
      queryKey: ["items", itemId],
      queryFn: async () => {
        return await serverRequester.get<Item<DetailedAccount>>(
          `/items/${itemId}`,
        );
      },
    });
  }

  public async prefetchMarketplace() {
    await this.queryClient.prefetchInfiniteQuery({
      queryKey: ["items", { status: ItemStatus.ForSale, limit: 10 }],
      queryFn: async () => {
        return await serverRequester.get<PaginatedItems>(
          "/items?status=0&limit=10",
        );
      },
      initialPageParam: undefined,
    });
  }

  public async prefetchBelongings(accountId: number) {
    await this.queryClient.prefetchInfiniteQuery({
      queryKey: ["items", { seller_id: accountId, limit: 10 }],
      queryFn: async () => {
        return await serverRequester.get<PaginatedItems>(
          `/items?seller_id=${accountId}&limit=10`,
        );
      },
      initialPageParam: undefined,
    });
  }

  public async prefetchWishlist(accountId: number) {
    await this.queryClient.prefetchInfiniteQuery({
      queryKey: ["wishlists", accountId, { limit: 10 }],
      queryFn: async () => {
        return await serverRequester.get<PaginatedItems>(
          `/wishlists/${accountId}?limit=10`,
        );
      },
      initialPageParam: undefined,
    });
  }

  public async prefetchWishlistEntry(accountId: number, itemId: string) {
    await this.queryClient.prefetchQuery({
      queryKey: ["wishlists", accountId, "items", itemId],
      queryFn: async () => {
        return await serverRequester.get<WishlistEntry>(
          `/wishlists/${accountId}/items/${itemId}`,
        );
      },
    });
  }

  public async prefetchWishlistStatistics(itemId: string) {
    await this.queryClient.prefetchQuery({
      queryKey: ["wishlists", "statistics", itemId],
      queryFn: async () => {
        return await serverRequester.get<WishlistStatistics>(
          `/wishlists/statistics/${itemId}`,
        );
      },
    });
  }

  public async prefetchTransactions() {
    await this.queryClient.prefetchQuery({
      queryKey: ["transactions"],
      queryFn: async () => {
        return await serverRequester.get<Transaction[]>("/transactions");
      },
    });
  }

  public async prefetchLastTransaction(itemId: string) {
    await this.queryClient.prefetchQuery({
      queryKey: ["transactions", { item_id: itemId, exclude_cancelled: true }],
      queryFn: async () => {
        const transactions = await serverRequester.get<Transaction[]>(
          `/transactions?item_id=${itemId}&exclude_cancelled=true`,
        );
        return transactions[0];
      },
    });
  }
}

export function createPrefetcher() {
  return new Prefetcher();
}
