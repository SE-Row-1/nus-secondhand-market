import { prefetchItem, prefetchMe } from "@/prefetchers";
import { ChevronLeftIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { EditItemForm } from "./form";

type Props = {
  params: {
    id: string;
  };
};

export default async function Page({ params: { id } }: Props) {
  const [{ data: item, error: itemError }, { data: me, error: meError }] =
    await Promise.all([prefetchItem(id), prefetchMe()]);

  if (itemError && itemError.status === 404) {
    notFound();
  }

  if (itemError) {
    redirect(`/error?message=${itemError.message}`);
  }

  if (meError && meError.status === 401) {
    redirect("/login");
  }

  if (meError) {
    redirect(`/error?message=${meError.message}`);
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
      <EditItemForm id={id} initialItem={item} />
    </div>
  );
}

export const metadata: Metadata = {
  title: "Edit item",
};
