import { prefetchWishlistStatistics } from "@/prefetchers";
import { WishlistStatisticsClient } from "./wishlist-statistics.client";

type Props = {
  itemId: string;
};

export async function WishlistStatisticsServer({ itemId }: Props) {
  const { data: initialWishlistStatistics, error } =
    await prefetchWishlistStatistics(itemId);

  if (error) {
    return null;
  }

  return (
    <WishlistStatisticsClient
      itemId={itemId}
      initialWishlistStatistics={initialWishlistStatistics}
    />
  );
}
