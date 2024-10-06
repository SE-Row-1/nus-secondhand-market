import { ItemStatus, type SingleItem } from "@/types";
import { ShoppingBagIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import { cn } from "../ui/utils";

type Props = {
  item: SingleItem;
};

export function SingleItemCard({ item }: Props) {
  const { color: statusColor, text: statusText } = translateStatus(item.status);

  return (
    <Card className="group relative flex flex-col hover:bg-muted/30 transition-colors overflow-hidden">
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
            className="w-full"
          />
        ) : (
          <div className="grid place-items-center h-full bg-muted">
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
        <div className="flex items-center gap-3">
          <Avatar className="size-8 lg:size-10">
            <AvatarImage
              src={item.seller.avatar_url ?? undefined}
              alt="Avatar of the seller"
            />
            <AvatarFallback>
              {item.seller.nickname ?? "Seller " + item.seller.id}
            </AvatarFallback>
          </Avatar>
          <p>{item.seller.nickname ?? "Seller " + item.seller.id}</p>
        </div>
      </div>
      <Link href="#" className="absolute inset-0">
        <span className="sr-only">View item detail</span>
      </Link>
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
