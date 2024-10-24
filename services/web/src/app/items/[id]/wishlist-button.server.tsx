import { Button } from "@/components/ui/button";
import { prefetchMe, prefetchWishlistEntry } from "@/query/server";
import type { Item } from "@/types";
import { HeartIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { WishlistButtonClient } from "./wishlist-button.client";

type Props = {
  item: Item;
};

export async function WishlistButtonServer({ item }: Props) {
  const { data: me, error: meError } = await prefetchMe();

  if (meError && meError.status !== 401) {
    redirect(`/error?message=${meError.message}`);
  }

  if (meError) {
    return (
      <Button asChild>
        <Link href="/login">
          <HeartIcon className="size-4 mr-2" />
          Want it
        </Link>
      </Button>
    );
  }

  const { data: wishlistItem } = await prefetchWishlistEntry(me.id, item.id);

  return (
    <WishlistButtonClient
      item={item}
      meId={me.id}
      initialIsInWishlist={wishlistItem !== null}
    />
  );
}
