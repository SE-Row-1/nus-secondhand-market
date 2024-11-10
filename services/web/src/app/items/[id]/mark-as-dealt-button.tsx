"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { clientRequester } from "@/query/requester/client";
import { type SimplifiedAccount, type Transaction } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckIcon, Loader2Icon } from "lucide-react";
import { useParams } from "next/navigation";

type Props = {
  buyer: SimplifiedAccount;
  onDealt: () => void;
};

export function MarkAsDealtButton({ buyer, onDealt }: Props) {
  const { id: itemId } = useParams<{ id: string }>();

  const queryClient = useQueryClient();

  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      return await clientRequester.post<Transaction>("/transactions", {
        item_id: itemId,
        buyer_id: buyer.id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      onDealt();
    },
    onError: (error) => {
      toast({ variant: "destructive", description: error.message });
    },
  });

  return (
    <Button size="sm" disabled={isPending} onClick={() => mutate()}>
      {isPending ? (
        <Loader2Icon className="size-3.5 mr-1.5 animate-spin" />
      ) : (
        <CheckIcon className="size-3.5 mr-1.5" />
      )}
      Deal
    </Button>
  );
}
