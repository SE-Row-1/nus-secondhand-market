import { prefetchMe, prefetchWishlist } from "@/query/server";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { WishList } from "./wishlist";

export default async function WishlistPage() {
  const { data: me, error: meError } = await prefetchMe();

  if (meError && meError.status === 401) {
    redirect("/login");
  }

  if (meError) {
    redirect(`/error?message=${meError.message}`);
  }

  const { data: page, error: pageError } = await prefetchWishlist(me.id);

  if (pageError) {
    redirect(`/error?message=${pageError.message}`);
  }

  return <WishList firstPage={page} me={me} />;
}

export const metadata: Metadata = {
  title: "My Wishlist",
};
