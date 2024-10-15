import type { DetailedAccount, PaginatedItems, SingleItem } from "@/types";
import { serverRequester } from "@/utils/requester/server";
import { cache } from "react";

export const prefetchMe = cache(async () => {
  return await serverRequester.get<DetailedAccount>("/auth/me");
});

export const prefetchItem = cache(async (id: string) => {
  return await serverRequester.get<SingleItem<DetailedAccount>>(`/items/${id}`);
});

export const prefetchMarketplace = cache(async () => {
  return await serverRequester.get<PaginatedItems>("/items?status=0&limit=8");
});

export const prefetchBelongings = cache(async (userId: number) => {
  return await serverRequester.get<PaginatedItems>(
    `/items?seller_id=${userId}&limit=8`,
  );
});

export const prefetchWishlist = cache(async (userId: number) => {
  return await serverRequester.get<PaginatedItems>(
    `/wishlists/${userId}?limit=8`,
  );
});
