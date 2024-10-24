"use client";

import { useWishlistStatistics } from "@/query/browser";
import { useParams } from "next/navigation";
import { Wanters } from "./wanters";

export function WishlistStatisticsSeller() {
  const { id: itemId } = useParams<{ id: string }>();

  const { data: wishlistStatistics } = useWishlistStatistics(itemId);

  if (!wishlistStatistics) {
    return null;
  }

  if (wishlistStatistics.wanters.length === 0) {
    return (
      <p className="p-3 border rounded-md">
        🤔 No one has wanted this item yet.
      </p>
    );
  }

  return <Wanters wanters={wishlistStatistics.wanters} />;
}
