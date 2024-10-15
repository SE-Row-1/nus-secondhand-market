import { PageTitle } from "@/components/framework";
import { prefetchMe } from "@/prefetches/me";
import { serverRequester } from "@/utils/requester/server";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { BelongingsList } from "./belongings-list";
import type { ResPage } from "./types";

export default async function BelongingsPage() {
  const { data: me, error: meError } = await prefetchMe();

  if (meError && meError.status === 401) {
    redirect("/login?next=/belongings");
  }

  if (meError) {
    redirect(`/error?message=${meError.message}`);
  }

  const { data: page, error: pageError } = await serverRequester.get<ResPage>(
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
      <BelongingsList firstPage={page} me={me} />
    </>
  );
}

export const metadata: Metadata = {
  title: "My Belongings",
};
