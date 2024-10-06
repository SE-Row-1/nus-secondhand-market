import type { ItemStatus, SingleItem } from "@/types";
import { ServerRequester } from "@/utils/requester/server";
import { ItemCardListClient } from "./item-card-list-client";

type Props = {
  limit?: number;
  type?: "single" | "pack";
  status?: ItemStatus;
  sellerId?: number;
};

export async function ItemCardListServer({
  limit = 8,
  type,
  status,
  sellerId,
}: Props) {
  const initialSearchParams = new URLSearchParams();
  initialSearchParams.set("limit", String(limit));
  if (type) {
    initialSearchParams.set("type", type);
  }
  if (status !== undefined) {
    initialSearchParams.set("status", String(status));
  }
  if (sellerId) {
    initialSearchParams.set("seller_id", String(sellerId));
  }

  const initialData = await new ServerRequester().get<{
    items: SingleItem[];
    count: number;
    nextCursor: string;
  }>(`/items?${initialSearchParams.toString()}`);

  return (
    <ItemCardListClient
      initialData={initialData}
      initialSearchParams={initialSearchParams.toString()}
    />
  );
}
