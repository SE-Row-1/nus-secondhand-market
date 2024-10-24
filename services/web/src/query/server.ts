import {
  ItemStatus,
  type DetailedAccount,
  type Item,
  type PaginatedItems,
  type Transaction,
  type WishlistEntry,
  type WishlistStatistics,
} from "@/types";
import { dehydrate } from "@tanstack/react-query";
import { getQueryClient } from "./client";
import { serverRequester } from "./requester/server";

class Prefetcher {
  private queryClient = getQueryClient();

  public dehydrate() {
    return dehydrate(this.queryClient);
  }

  public async prefetchMe() {
    const queryKey = ["auth", "me"];

    await this.queryClient.prefetchQuery({
      queryKey,
      queryFn: async () => {
        return await serverRequester.get<DetailedAccount>("/auth/me");
      },
    });

    return this.queryClient.getQueryData<DetailedAccount>(queryKey);
  }

  public async prefetchItem(itemId: string) {
    const queryKey = ["items", itemId];

    await this.queryClient.prefetchQuery({
      queryKey,
      queryFn: async () => {
        return await serverRequester.get<Item<DetailedAccount>>(
          `/items/${itemId}`,
        );
      },
    });

    return this.queryClient.getQueryData<Item<DetailedAccount>>(queryKey);
  }

  public async prefetchMarketplace() {
    const queryKey = ["items", { status: ItemStatus.ForSale, limit: 10 }];

    await this.queryClient.prefetchInfiniteQuery({
      queryKey,
      queryFn: async () => {
        return await serverRequester.get<PaginatedItems>(
          "/items?status=0&limit=10",
        );
      },
      initialPageParam: undefined,
    });

    return this.queryClient.getQueryData<PaginatedItems>(queryKey);
  }

  public async prefetchBelongings(accountId: number) {
    const queryKey = ["items", { seller_id: accountId, limit: 10 }];

    await this.queryClient.prefetchInfiniteQuery({
      queryKey,
      queryFn: async () => {
        return await serverRequester.get<PaginatedItems>(
          `/items?seller_id=${accountId}&limit=10`,
        );
      },
      initialPageParam: undefined,
    });

    return this.queryClient.getQueryData<PaginatedItems>(queryKey);
  }

  public async prefetchWishlist(accountId: number) {
    const queryKey = ["wishlists", accountId, { limit: 10 }];

    await this.queryClient.prefetchInfiniteQuery({
      queryKey,
      queryFn: async () => {
        return await serverRequester.get<PaginatedItems>(
          `/wishlists/${accountId}?limit=10`,
        );
      },
      initialPageParam: undefined,
    });

    return this.queryClient.getQueryData<PaginatedItems>(queryKey);
  }

  public async prefetchWishlistEntry(accountId: number, itemId: string) {
    const queryKey = ["wishlists", accountId, "items", itemId];

    await this.queryClient.prefetchQuery({
      queryKey,
      queryFn: async () => {
        return await serverRequester.get<WishlistEntry>(
          `/wishlists/${accountId}/items/${itemId}`,
        );
      },
    });

    return this.queryClient.getQueryData<WishlistEntry>(queryKey);
  }

  public async prefetchWishlistStatistics(itemId: string) {
    const queryKey = ["wishlists", "statistics", itemId];

    await this.queryClient.prefetchQuery({
      queryKey,
      queryFn: async () => {
        return await serverRequester.get<WishlistStatistics>(
          `/wishlists/statistics/${itemId}`,
        );
      },
    });

    return this.queryClient.getQueryData<WishlistStatistics>(queryKey);
  }

  public async prefetchTransactions() {
    const queryKey = ["transactions"];

    await this.queryClient.prefetchQuery({
      queryKey,
      queryFn: async () => {
        return await serverRequester.get<Transaction[]>("/transactions");
      },
    });

    return this.queryClient.getQueryData<Transaction[]>(queryKey);
  }

  public async prefetchLastTransaction(itemId: string) {
    const queryKey = [
      "transactions",
      { item_id: itemId, exclude_cancelled: true },
    ];

    await this.queryClient.prefetchQuery({
      queryKey,
      queryFn: async () => {
        const transactions = await serverRequester.get<Transaction[]>(
          `/transactions?item_id=${itemId}&exclude_cancelled=true`,
        );
        return transactions[0] ?? null;
      },
    });

    return this.queryClient.getQueryData<Transaction>(queryKey);
  }
}

export function createPrefetcher() {
  return new Prefetcher();
}
