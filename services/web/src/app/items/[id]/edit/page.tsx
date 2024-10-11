import { EditItem } from "@/components/item/edit/edit-item";
import type { Account, SingleItem } from "@/types";
import { ServerRequester } from "@/utils/requester/server";
import { ChevronLeftIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: {
    id: string;
  };
};

export default async function Page({ params: { id } }: Props) {
  const item = await new ServerRequester().get<SingleItem<Account> | undefined>(
    `/items/${id}`,
  );

  if (!item) {
    notFound();
  }

  return (
    <div className="max-w-xl min-h-[calc(100vh-84px)] py-4 md:py-8 mx-auto">
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
