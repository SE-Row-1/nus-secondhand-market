import type { ItemStatus, ItemType, SingleItem } from "@/types";
import { serverRequester } from "@/utils/requester/server";
import { redirect } from "next/navigation";
import { ItemCardListClient } from "./item-card-list-client";

type Props = {
  limit?: number;
  type?: ItemType;
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

  const { data: initialData, error } = await serverRequester.get<{
    items: SingleItem[];
    next_cursor: string;
  }>(`/items?${initialSearchParams.toString()}`);

  if (error) {
    redirect(`/error?message=${error.message}`);
  }

  return (
    <ItemCardListClient
      initialData={initialData}
      initialSearchParams={initialSearchParams.toString()}
    />
  );
}