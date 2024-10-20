import { PageTitle } from "@/components/layout";
import { prefetchBelongings, prefetchMe } from "@/prefetchers";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Belongings } from "./components/belongings";
import { ComposePackDialog } from "./components/compose-pack-dialog";

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
      <div className="flex justify-between items-center flex-wrap gap-4 mb-8">
        <PageTitle
          title="My belongings"
          description="Here are the items you have listed"
        />
        <ComposePackDialog />
      </div>
      <Belongings firstPage={page} me={me} />
    </>
  );
}

export const metadata: Metadata = {
  title: "My Belongings",
};
