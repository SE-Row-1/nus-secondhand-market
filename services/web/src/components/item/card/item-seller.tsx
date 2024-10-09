import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { AccountPreview } from "@/types";

type Props = {
  seller: AccountPreview;
};

export function ItemSeller({ seller }: Props) {
  return (
    <div className="flex items-center gap-2.5">
      <Avatar className="size-8 brightness-75 group-hover:brightness-100 transition">
        <AvatarImage
          src={seller.avatar_url ?? undefined}
          alt="Seller's avatar"
        />
        <AvatarFallback>
          {seller.nickname ?? "Seller " + seller.id}
        </AvatarFallback>
      </Avatar>
      <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
        {seller.nickname ?? "Seller " + seller.id}
      </span>
    </div>
  );
}
