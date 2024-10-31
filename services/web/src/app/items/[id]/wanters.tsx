"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useLastTransaction } from "@/query/browser";
import type { SimplifiedAccount } from "@/types";
import { BanIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { MarkAsDealtButton } from "./mark-as-dealt-button";
import { MarkAsForSaleButton } from "./mark-as-for-sale-button";

type Props = {
  wanters: SimplifiedAccount[];
};

export function Wanters({ wanters }: Props) {
  const { id: itemId } = useParams<{ id: string }>();

  const { data: transaction } = useLastTransaction(itemId);

  const [dealtWithId, setDealtWithId] = useState(transaction?.buyer?.id ?? -1);

  return (
    <ul className="space-y-2 px-4 py-3 border rounded-md">
      {wanters.map((wanter) => (
        <li key={wanter.id} className="group flex items-center gap-3">
          <Avatar className="size-6">
            <AvatarImage
              src={wanter.avatar_url ?? undefined}
              alt="Wanter's avatar"
            />
            <AvatarFallback>{wanter.nickname}</AvatarFallback>
          </Avatar>
          <span>{wanter.nickname ?? "Someone"}</span>
          <div className="ml-auto">
            {dealtWithId === -1 ? (
              <MarkAsDealtButton
                buyer={wanter}
                onDealt={() => setDealtWithId(wanter.id)}
              />
            ) : dealtWithId === wanter.id ? (
              <MarkAsForSaleButton
                transactionId={transaction!.id}
                onSuccess={() => setDealtWithId(-1)}
              />
            ) : dealtWithId !== wanter.id ? (
              <Button variant="outline" size="sm" disabled>
                <BanIcon className="size-3.5 mr-1.5" />
                Declined
              </Button>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
}
