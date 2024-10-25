import { createPrefetcher } from "@/query/server";
import { ItemType } from "@/types";
import { ChevronLeftIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { EditItemForm } from "./form";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  const prefetcher = createPrefetcher();

  const me = await prefetcher.prefetchMe();

  if (!me) {
    redirect("/login");
  }

  const item = await prefetcher.prefetchItem(id);

  if (!item) {
    notFound();
  }

  if (item.seller.id !== me.id) {
    redirect(`/items/${id}`);
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      <Link
        href={`/items/${id}`}
        className="flex items-center mb-8 text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        <ChevronLeftIcon className="size-4 mr-2" />
        Back to details
      </Link>
      {item.type === ItemType.Single && <EditItemForm id={id} />}
    </div>
  );
}

export const metadata: Metadata = {
  title: "Edit item",
};
