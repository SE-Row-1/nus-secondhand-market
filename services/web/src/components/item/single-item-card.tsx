import { ItemStatus, type SingleItem } from "@/types";
import { ShoppingBagIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import { cn } from "../ui/utils";
import { DeleteItemDialog } from "./delete-item-button";

type Props = {
  item: SingleItem;
};

export function SingleItemCard({ item }: Props) {
  const { color: statusColor, text: statusText } = translateStatus(item.status);

  return (
    <Card className="group relative flex flex-col hover:bg-muted/30 transition-colors">
      <Badge
        className={cn("absolute top-4 left-4 uppercase z-10", statusColor)}
      >
        {statusText}
      </Badge>
      <div className="relative aspect-square">
        {item.photo_urls[0] ? (
          <Image
            src={item.photo_urls[0]}
            alt="A photo of this second-hand item"
            width={200}
            height={200}
            className="w-full rounded-t-lg"
          />
        ) : (
          <div className="grid place-items-center h-full rounded-t-lg bg-muted">
            <ShoppingBagIcon className="size-2/5 text-muted-foreground" />
          </div>
        )}
      </div>
      <div className="grow flex flex-col gap-2 px-5 py-4">
        <div className="flex justify-between items-center flex-wrap gap-x-2 gap-y-1">
          <p className="font-semibold text-lg line-clamp-1">{item.name}</p>
          <p className="text-sm">{item.price}&nbsp;SGD</p>
        </div>
        <p className="grow pb-1 text-sm text-muted-foreground group-hover:text-foreground transition-colors line-clamp-3">
          {item.description}
        </p>
        <div className="flex items-center gap-2.5">
          <Avatar className="size-8">
            <AvatarImage
              src={item.seller.avatar_url ?? undefined}
              alt="Avatar of the seller"
            />
            <AvatarFallback>
              {item.seller.nickname ?? "Seller " + item.seller.id}
            </AvatarFallback>
          </Avatar>
          <p className="text-sm">
            {item.seller.nickname ?? "Seller " + item.seller.id}
          </p>
        </div>
      </div>
      <Link
        href="#"
        className="absolute inset-0 rounded-lg ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <span className="sr-only">View item detail</span>
      </Link>
      <div className="flex justify-evenly items-center absolute inset-x-0 bottom-0 translate-y-1/2">
        <DeleteItemDialog item={item} />
      </div>
    </Card>
  );
}

function translateStatus(status: ItemStatus) {
  switch (status) {
    case ItemStatus.FOR_SALE:
      return { color: "bg-green-600", text: "For sale" };
    case ItemStatus.DEALT:
      return { color: "bg-yellow-600", text: "Dealt" };
    case ItemStatus.SOLD:
      return { color: "bg-red-600", text: "Sold" };
  }
}
