import { SingleItemDetailsCard } from "@/components/item/details";
import type { Account, SingleItem } from "@/types";
import { ServerRequester } from "@/utils/requester/server";
import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";

type Props = {
  params: {
    id: string;
  };
};

export default async function Page({ params: { id } }: Props) {
  const item = await getItem(id);

  if (!item) {
    notFound();
  }

  return (
    <div className="flex flex-col justify-center relative min-h-[calc(100vh-84px)] ">
      <Link
        href="/"
        className="flex items-center absolute top-4 left-4 text-sm sm:text-base hover:text-primary transition-colors"
      >
        <ChevronLeftIcon className="size-4 mr-2" />
        Back to marketplace
      </Link>
      <SingleItemDetailsCard item={item} />
    </div>
  );
}

export async function generateMetadata({ params: { id } }: Props) {
  const item = await getItem(id);

  return {
    title: item?.name,
  };
}

const getItem = cache(async (id: string) => {
  return await new ServerRequester().get<SingleItem<Account> | undefined>(
    `/items/${id}`,
  );
});
