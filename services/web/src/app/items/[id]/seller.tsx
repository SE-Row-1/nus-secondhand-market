import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { DetailedAccount } from "@/types";

type Props = {
  seller: DetailedAccount;
};

export function Seller({ seller }: Props) {
  return (
    <div className="flex items-center gap-3">
      <Avatar className="size-10">
        <AvatarImage
          src={seller.avatar_url ?? undefined}
          alt="Seller's avatar"
        />
        <AvatarFallback>
          {seller.nickname ?? "Seller " + seller.id}
        </AvatarFallback>
      </Avatar>
      <span>{seller.nickname ?? "Seller " + seller.id}</span>
      {seller.department && (
        <Tooltip>
          <TooltipTrigger>
            <Badge variant="outline" className="rounded-lg">
              {seller.department?.acronym}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>{seller.department.name}</TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}
