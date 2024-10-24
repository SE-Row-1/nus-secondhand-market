import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { ItemType, type Item } from "@/types";
import { BoxesIcon } from "lucide-react";
import Link from "next/link";
import { Cover } from "./cover";
import { FromNow } from "./from-now";
import { StatusBadge } from "./status-badge";

type Props = {
  item: Item;
};

export function ItemCard({ item }: Props) {
  return (
    <Card className="group relative flex flex-col hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
      <div className="absolute top-3 left-4 z-10">
        <StatusBadge status={item.status} />
      </div>
      {item.type === ItemType.Single ? (
        <Cover photoUrls={item.photo_urls} />
      ) : (
        <div className="grid place-items-center aspect-square rounded-t-lg bg-muted">
          <BoxesIcon className="size-1/3 text-muted-foreground" />
        </div>
      )}
      <div className="grow flex flex-col justify-between gap-2 px-5 py-4">
        <div className="flex justify-between items-center flex-wrap gap-x-2 gap-y-1">
          <p className="font-semibold text-lg line-clamp-1">{item.name}</p>
          <p className="font-medium text-primary">
            {item.type === ItemType.Single
              ? `${item.price} SGD`
              : `-${item.discount * 100}%`}
          </p>
        </div>
        <div className="flex justify-between items-center flex-wrap gap-x-2 gap-y-1 text-muted-foreground group-hover:text-foreground transition-colors">
          <div className="flex items-center gap-2.5">
            <Avatar className="size-8">
              <AvatarImage
                src={item.seller.avatar_url ?? undefined}
                alt="Seller's avatar"
              />
              <AvatarFallback>
                {item.seller.nickname ?? "Seller " + item.seller.id}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm">
              {item.seller.nickname ?? "Seller " + item.seller.id}
            </span>
          </div>
          <FromNow date={item.created_at} className="text-sm" />
        </div>
      </div>
      <Link
        href={`/items/${item.id}`}
        className="absolute inset-0 rounded-lg ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <span className="sr-only">View item detail</span>
      </Link>
    </Card>
  );
}
