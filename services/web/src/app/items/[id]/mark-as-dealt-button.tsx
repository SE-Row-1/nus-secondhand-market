"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { clientRequester } from "@/query/requester/client";
import { ItemStatus, type SimplifiedAccount } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckIcon, Loader2Icon } from "lucide-react";

type Props = {
  itemId: string;
  buyer: SimplifiedAccount;
  onDealt: () => void;
};

export function MarkAsDealtButton({ itemId, buyer, onDealt }: Props) {
  const queryClient = useQueryClient();

  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      return await clientRequester.put(`/items/${itemId}/status`, {
        status: ItemStatus.Dealt,
        buyer,
      });
    },
    onSuccess: (item) => {
      queryClient.setQueryData(["items", itemId], item);
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
