import { Card } from "@/components/ui/card";
import { type SingleItem } from "@/types";
import Link from "next/link";
import { ItemPhoto } from "./item-photo";
import { ItemPublishedAt } from "./item-published-at";
import { ItemSeller } from "./item-seller";
import { ItemStatusBadge } from "./item-status-badge";

type Props = {
  item: SingleItem;
};

export function SingleItemCard({ item }: Props) {
  return (
    <Card className="group relative flex flex-col hover:bg-muted/30 transition-colors">
      <div className="absolute top-3 left-4 z-10">
        <ItemStatusBadge status={item.status} />
      </div>
      <div className="rounded-t-lg overflow-hidden">
        <ItemPhoto photoUrl={item.photo_urls[0]} />
      </div>
      <div className="grow flex flex-col justify-between gap-2 px-5 py-4">
        <div className="flex justify-between items-center flex-wrap gap-x-2 gap-y-1">
          <p className="font-semibold text-lg line-clamp-1">{item.name}</p>
          <p className="font-medium text-primary">{item.price}&nbsp;SGD</p>
        </div>
        <div className="flex justify-between items-center flex-wrap gap-x-2 gap-y-1">
          <ItemSeller seller={item.seller} />
          <ItemPublishedAt publishedAt={item.created_at} />
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
