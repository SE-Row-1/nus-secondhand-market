import { PageTitle } from "@/components/framework";
import { prefetchBelongings, prefetchMe } from "@/prefetchers";
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

  const { data: page, error: pageError } = await prefetchBelongings(me.id);

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
