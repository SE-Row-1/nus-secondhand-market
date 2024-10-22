"use client";

import { FromNow } from "@/components/item/from-now";
import type { Item, SimplifiedAccount, WishlistStatistics } from "@/types";
import { clientRequester } from "@/utils/requester/client";
import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";

type Props = {
  item: Item;
  me: SimplifiedAccount | null;
  initialWishlistStatistics: WishlistStatistics;
  wantersList: ReactNode;
};

export function WishlistStatisticsClient({
  item,
  me,
  initialWishlistStatistics,
  wantersList,
}: Props) {
  const { data: wishlistStatistics } = useQuery({
    queryKey: ["wishlists", "statistics", item.id],
    queryFn: async () => {
      return await clientRequester.get<WishlistStatistics>(
        `/wishlists/statistics/${item.id}`,
      );
    },
    initialData: initialWishlistStatistics,
  });

  if (me?.id !== item.seller.id) {
    if (wishlistStatistics.count >= 3) {
      return (
        <p className="p-3 border rounded-md">
          🔥 {wishlistStatistics.count} people want this item.
        </p>
      );
    }

    if (wishlistStatistics.last_wanted_at) {
      return (
        <p className="p-3 border rounded-md">
          👀 Someone wanted it&nbsp;
          <FromNow date={wishlistStatistics.last_wanted_at} />.
        </p>
      );
    }

    return (
      <p className="px-3 sm:px-4 py-2 sm:py-3 border rounded-md">
        🙌 Be the first to want this item!
      </p>
    );
  }

  if (!wishlistStatistics.wanters || wishlistStatistics.wanters.length === 0) {
    return (
      <p className="px-3 sm:px-4 py-2 sm:py-3 border rounded-md">
        🤔 No one has wanted this item yet.
      </p>
    );
  }

  return wantersList;
}
