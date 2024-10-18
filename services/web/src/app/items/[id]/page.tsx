import { SingleItemDetails } from "@/components/item/details";
import {
  prefetchItem,
  prefetchMe,
  prefetchWishlistStatistics,
} from "@/prefetchers";
import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

type Props = {
  params: {
    id: string;
  };
};

export default async function Page({ params: { id } }: Props) {
  const [
    { data: item, error: itemError },
    { data: wishlistStatistics },
    { data: me, error: meError },
  ] = await Promise.all([
    prefetchItem(id),
    prefetchWishlistStatistics(id),
    prefetchMe(),
  ]);

  if (itemError && itemError.status === 404) {
    notFound();
  }

  if (itemError) {
    redirect(`/error?message=${itemError.message}`);
  }

  if (meError && meError.status !== 401) {
    redirect(`/error?message=${meError.message}`);
  }

  const safeWishlistStatistics = wishlistStatistics ?? {
    count: 0,
    last_wanted_at: null,
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <Link
        href="/"
        className="flex items-center mb-8 text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        <ChevronLeftIcon className="size-4 mr-2" />
        Back to marketplace
      </Link>
      <SingleItemDetails
        initialItem={item}
        wishlistStatistics={safeWishlistStatistics}
        me={me}
      />
    </div>
  );
}

export async function generateMetadata({ params: { id } }: Props) {
  const { data: item } = await prefetchItem(id);

  return {
    title: item?.name,
  };
}
