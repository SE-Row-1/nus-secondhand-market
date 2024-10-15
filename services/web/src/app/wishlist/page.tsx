import { PageTitle } from "@/components/framework";
import { prefetchMe } from "@/prefetches/me";
import { serverRequester } from "@/utils/requester/server";
import { redirect } from "next/navigation";
import type { ResPage } from "./types";
import { WishList } from "./wishlist";

export default async function WishlistPage() {
  const { data: me, error: meError } = await prefetchMe();

  if (meError && meError.status === 401) {
    redirect("/login");
  }

  if (meError) {
    redirect(`/error?message=${meError.message}`);
  }

  const { data: page, error: pageError } = await serverRequester.get<ResPage>(
    `/wishlists/${me.id}?limit=8`,
  );

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
