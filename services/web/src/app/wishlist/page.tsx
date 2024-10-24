import { createPrefetcher } from "@/query/server";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { WishList } from "./wishlist";

export default async function WishlistPage() {
  const prefetcher = createPrefetcher();

  const me = await prefetcher.prefetchMe();

  if (!me) {
    redirect("/login");
  }

  await prefetcher.prefetchWishlist(me.id);

  return <WishList />;
}

export const metadata: Metadata = {
  title: "My Wishlist",
};
