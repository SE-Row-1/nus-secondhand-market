import {
  ItemStatus,
  type DetailedAccount,
  type Item,
  type PaginatedItems,
  type Transaction,
  type WishlistEntry,
  type WishlistStatistics,
} from "@/types";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { clientRequester } from "./requester/client";
import { HttpError } from "./requester/http-error";

export function useMe() {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      try {
        return await clientRequester.get<DetailedAccount>("/auth/me");
      } catch (error) {
        if (error instanceof HttpError && error.status === 401) {
          return null;
        }
        throw error;
      }
    },
  });
}

export function useItem(itemId: string) {
  return useQuery({
    queryKey: ["items", itemId],
    queryFn: async () => {
      return await clientRequester.get<Item<DetailedAccount>>(
        `/items/${itemId}`,
      );
    },
  });
}

export function useMarketplace() {
  return useInfiniteQuery({
    queryKey: ["items", { status: ItemStatus.ForSale, limit: 10 }],
    queryFn: async ({ pageParam: cursor }) => {
      const searchParams = new URLSearchParams({
        status: String(ItemStatus.ForSale),
        limit: "10",
        ...(cursor && { cursor }),
      });

      return await clientRequester.get<PaginatedItems>(
        `/items?${searchParams.toString()}`,
      );
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.next_cursor,
  });
}

export function useBelongings(accountId: number) {
  return useInfiniteQuery({
    queryKey: ["items", { seller_id: accountId, limit: 10 }],
    queryFn: async ({ pageParam: cursor }) => {
      const searchParams = new URLSearchParams({
        seller_id: String(accountId),
        limit: "10",
        ...(cursor && { cursor }),
      });

      return await clientRequester.get<PaginatedItems>(
        `/items?${searchParams.toString()}`,
      );
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.next_cursor,
  });
}

export function useWishlist(accountId: number) {
  return useInfiniteQuery({
    queryKey: ["wishlists", accountId, { limit: 10 }],
    queryFn: async ({ pageParam: cursor }) => {
      const searchParams = new URLSearchParams({
        limit: "10",
        ...(cursor && { cursor }),
      });

      return await clientRequester.get<PaginatedItems>(
        `/wishlists/${accountId}?${searchParams.toString()}`,
      );
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.next_cursor,
  });
}

export function useWishlistEntry(accountId: number, itemId: string) {
  return useQuery({
    queryKey: ["wishlists", accountId, "items", itemId],
    queryFn: async () => {
      try {
        return await clientRequester.get<WishlistEntry>(
          `/wishlists/${accountId}/items/${itemId}`,
        );
      } catch (error) {
        if (error instanceof HttpError && error.status === 404) {
          return null;
        }
        throw error;
      }
    },
  });
}

export function useWishlistStatistics(itemId: string) {
  return useQuery({
    queryKey: ["wishlists", "statistics", itemId],
    queryFn: async () => {
      return await clientRequester.get<WishlistStatistics>(
        `/wishlists/statistics/${itemId}`,
      );
    },
  });
}

export function useTransactions() {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      return await clientRequester.get<Transaction[]>("/transactions");
    },
  });
}

export function useLastTransaction(itemId: string) {
  return useQuery({
    queryKey: ["transactions", { item_id: itemId, is_cancelled: false }],
    queryFn: async () => {
      const transactions = await clientRequester.get<Transaction[]>(
        `/transactions?item_id=${itemId}&is_cancelled=false`,
      );
      return transactions[0] ?? null;
    },
  });
}
