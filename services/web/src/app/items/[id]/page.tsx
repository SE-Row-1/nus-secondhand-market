import { getQueryClient } from "@/query/client";
import {
  prefetchItem,
  prefetchMe,
  prefetchTransaction,
  prefetchWishlistEntry,
  prefetchWishlistStatistics,
} from "@/query/server";
import type { DetailedAccount, Item } from "@/types";
import { ItemDetails } from "./item-details.client";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;
  const queryClient = getQueryClient();
  await Promise.all([
    prefetchMe(queryClient),
    prefetchItem(queryClient, id),
    prefetchWishlistEntry(queryClient, id),
    prefetchWishlistStatistics(queryClient, id),
    prefetchTransaction(queryClient, id),
  ]);

  return <ItemDetails id={id} />;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const queryClient = getQueryClient();
  await prefetchItem(queryClient, id);
  const item = queryClient.getQueryData<Item<DetailedAccount>>(["item", id]);

  return {
    title: item?.name,
  };
}
