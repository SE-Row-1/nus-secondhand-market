import { PageTitle } from "@/components/framework";
import { prefetchMe } from "@/prefetches/me";
import type { PaginatedItems } from "@/types";
import { serverRequester } from "@/utils/requester/server";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Belongings } from "./belongings";

export default async function BelongingsPage() {
  const { data: me, error: meError } = await prefetchMe();

  if (meError && meError.status === 401) {
    redirect("/login");
  }

  if (meError) {
    redirect(`/error?message=${meError.message}`);
  }

  const { data: page, error: pageError } =
    await serverRequester.get<PaginatedItems>(
      `/items?seller_id=${me.id}&limit=8`,
    );

  if (pageError) {
    redirect(`/error?message=${pageError.message}`);
  }

  return (
    <>
      <PageTitle
        title="My belongings"
        description="Here are the items you have listed"
        className="mb-8"
      />
      <Belongings firstPage={page} me={me} />
    </>
  );
}

export const metadata: Metadata = {
  title: "My Belongings",
};
