"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { clientRequester } from "@/query/requester/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2Icon, XIcon } from "lucide-react";

type Props = {
  transactionId: string | undefined;
  onSuccess: () => void;
};

export function MarkAsForSaleButton({ transactionId, onSuccess }: Props) {
  const queryClient = useQueryClient();

  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (!transactionId) {
        throw new Error("You are too fast! Please wait a second...");
      }

      return await clientRequester.post(
        `/transactions/${transactionId}/cancel`,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
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
