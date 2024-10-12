import { EditItem } from "@/components/item/edit/edit-item";
import type { Account, SingleItem } from "@/types";
import { serverRequester } from "@/utils/requester/server";
import { ChevronLeftIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

type Props = {
  params: {
    id: string;
  };
};

export default async function Page({ params: { id } }: Props) {
  const [{ data: item, error: itemError }, { data: me, error: meError }] =
    await Promise.all([
      serverRequester.get<SingleItem<Account>>(`/items/${id}`),
      serverRequester.get<Account>("/auth/me"),
    ]);

  if (itemError && itemError.status === 404) {
    notFound();
  }

  if (itemError) {
    redirect(`/error?message=${itemError}`);
  }

  if (meError && meError.status === 401) {
    redirect(`/login?next=/items/${id}/edit`);
  }

  if (meError) {
    redirect(`/error?message=${meError}`);
  }

  if (item.seller.id !== me.id) {
    redirect(`/items/${id}`);
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      <Link
        href={`/items/${id}`}
        className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        <ChevronLeftIcon className="size-4 mr-2" />
        Back to details
      </Link>
      <h1 className="pt-8 font-bold text-3xl">Edit item details</h1>
      <div className="pt-6">
        <EditItem id={id} initialItem={item} />
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: "Edit item",
};
