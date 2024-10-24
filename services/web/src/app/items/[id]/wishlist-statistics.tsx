"use client";

import { FromNow } from "@/components/item/from-now";
import { useWishlistStatistics } from "@/query/browser";
import { useParams } from "next/navigation";

export function WishlistStatistics() {
  const { id: itemId } = useParams<{ id: string }>();

  const { data: wishlistStatistics } = useWishlistStatistics(itemId);

  if (!wishlistStatistics) {
    return null;
  }

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
