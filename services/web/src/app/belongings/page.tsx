import { PageTitle } from "@/components/framework";
import { ItemCardList } from "@/components/item";
import { prefetchMe } from "@/prefetches/me";
import { ItemType } from "@/types";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export default async function BelongingsPage() {
  const { data: me, error } = await prefetchMe();

  if (error && error.status === 401) {
    redirect("/login?next=/belongings");
  }

  if (error) {
    redirect(`/error?message=${error.message}`);
  }

  return (
    <>
      <PageTitle
        title="My belongings"
        description="Here are the items you have listed"
        className="mb-8"
      />
      <ItemCardList type={ItemType.SINGLE} sellerId={me.id} />
    </>
  );
}

export const metadata: Metadata = {
  title: "My Belongings",
};
