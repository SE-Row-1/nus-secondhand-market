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
import { useMe } from "@/hooks/use-me";
import type { Item } from "@/types";
import { clientRequester } from "@/utils/requester/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckIcon, Loader2Icon, UnplugIcon, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import type { MouseEvent } from "react";

type Props = {
  item: Item;
};

export function DecomposePackDialog({ item }: Props) {
  const { data: me } = useMe();

  if (!me || me.id !== item.seller.id) {
    return null;
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          <UnplugIcon className="size-4 mr-2" />
          Decompose
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Decompose item pack</AlertDialogTitle>
          <AlertDialogDescription>
            The items in this pack will go back to your belongings, but this
            pack itself will be lost forever.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            <XIcon className="size-4 mr-2" />
            Cancel
          </AlertDialogCancel>
          <DecomposePackConfirmation itemId={item.id} />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

type DecomposePackConfirmationProps = {
  itemId: string;
};

function DecomposePackConfirmation({ itemId }: DecomposePackConfirmationProps) {
  const router = useRouter();

  const { toast } = useToast();

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      return await clientRequester.delete<undefined>(`/items/packs/${itemId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });

      toast({
        title: "Item pack decomposed",
        description: "Your item pack has been decomposed successfully.",
      });

      router.push("/");
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to decompose the pack",
        description: error.message,
      });
    },
  });

  return (
    <AlertDialogAction disabled={isPending} onClick={mutate}>
      {isPending ? (
        <Loader2Icon className="size-4 mr-2 animate-spin" />
      ) : (
        <CheckIcon className="size-4 mr-2" />
      )}
      Continue
    </AlertDialogAction>
  );
}
