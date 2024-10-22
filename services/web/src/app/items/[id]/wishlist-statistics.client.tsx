"use client";

import { FromNow } from "@/components/item/from-now";
import type { WishlistStatistics } from "@/types";
import { clientRequester } from "@/utils/requester/client";
import { useQuery } from "@tanstack/react-query";

type Props = {
  itemId: string;
  initialWishlistStatistics: WishlistStatistics;
};

export function WishlistStatisticsClient({
  itemId,
  initialWishlistStatistics,
}: Props) {
  const { data: wishlistStatistics } = useQuery({
    queryKey: ["wishlists", "statistics", itemId],
    queryFn: async () => {
      return await clientRequester.get<WishlistStatistics>(
        `/wishlists/statistics/${itemId}`,
      );
    },
    initialData: initialWishlistStatistics,
  });

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
