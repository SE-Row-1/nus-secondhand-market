import { PageTitle } from "@/components/layout";
import { prefetchMe, prefetchWishlist } from "@/prefetchers";
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

  return (
    <>
      <PageTitle
        title="My Wishlist"
        description="Here are the items you wanted"
        className="mb-8"
      />
      <WishList firstPage={page} me={me} />
    </>
  );
}

export const metadata: Metadata = {
  title: "My Wishlist",
};
