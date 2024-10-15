import type { DetailedAccount, SingleItem } from "@/types";
import { serverRequester } from "@/utils/requester/server";
import { cache } from "react";

export const prefetchItem = cache(async (id: string) => {
  return await serverRequester.get<SingleItem<DetailedAccount>>(`/items/${id}`);
});
