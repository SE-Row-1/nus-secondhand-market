"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { clientRequester } from "@/query/requester/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCheckIcon, CheckIcon, Loader2Icon, XIcon } from "lucide-react";

type Props = {
  transactionId: string;
};

export function MarkAsSoldButton({ transactionId }: Props) {
  const queryClient = useQueryClient();

  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      return await clientRequester.post(
        `/transactions/${transactionId}/complete`,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: (error) => {
      toast({ variant: "destructive", description: error.message });
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>
          <CheckCheckIcon className="size-4 mr-2" />
          Confirm receipt
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Receipt</AlertDialogTitle>
          <AlertDialogDescription>
            After your confirmation, this item will be marked as sold. This
            status change is irreversible by anyone, so please make sure you
            have really received the item, and have reached an agreement with
            the seller.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            <XIcon className="size-4 mr-2" />
            Think twice
          </AlertDialogCancel>
          <AlertDialogAction disabled={isPending} onClick={() => mutate()}>
            {isPending ? (
              <Loader2Icon className="size-4 mr-2 animate-spin" />
            ) : (
              <CheckIcon className="size-4 mr-2" />
            )}
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
