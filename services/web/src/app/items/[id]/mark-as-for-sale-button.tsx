"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { clientRequester } from "@/query/requester/client";
import { ItemStatus } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2Icon, XIcon } from "lucide-react";

type Props = {
  itemId: string;
  onSuccess: () => void;
};

export function MarkAsForSaleButton({ itemId, onSuccess }: Props) {
  const queryClient = useQueryClient();

  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      return await clientRequester.put(`/items/${itemId}/status`, {
        status: ItemStatus.ForSale,
      });
    },
    onSuccess: (item) => {
      queryClient.setQueryData(["items", itemId], item);
      onSuccess();
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
        <XIcon className="size-3.5 mr-1.5" />
      )}
      Cancel
    </Button>
  );
}
