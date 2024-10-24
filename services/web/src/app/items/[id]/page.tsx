import { createPrefetcher } from "@/query/server";
import { ItemDetails } from "./item-details";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  const prefetcher = createPrefetcher();

  const [me] = await Promise.all([
    prefetcher.prefetchMe(),
    prefetcher.prefetchItem(id),
    prefetcher.prefetchWishlistStatistics(id),
    prefetcher.prefetchLastTransaction(id),
  ]);

  if (me) {
    await prefetcher.prefetchWishlistEntry(me.id, id);
  }

  return <ItemDetails />;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;

  const prefetcher = createPrefetcher();

  const item = await prefetcher.prefetchItem(id);

  return {
    title: item?.name,
  };
}
