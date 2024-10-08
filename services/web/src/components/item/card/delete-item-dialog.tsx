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
import { useMe } from "@/hooks/use-me";
import { useToast } from "@/hooks/use-toast";
import type { SingleItem } from "@/types";
import { ClientRequester } from "@/utils/requester/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckIcon, Loader2Icon, TrashIcon, XIcon } from "lucide-react";
import type { MouseEvent } from "react";

type Props = {
  item: SingleItem;
};

export function DeleteItemDialog({ item }: Props) {
  const { data: me } = useMe();

  if (!me || me.id !== item.seller.id) {
    return null;
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          size="icon"
          className="rounded-full scale-0 group-hover:scale-100 group-focus-within:scale-100 transition"
        >
          <TrashIcon className="size-4" />
          <span className="sr-only">Take down this item</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Your item will be deleted</AlertDialogTitle>
          <AlertDialogDescription>
            This item will be removed from your belongings and others&apos;
            wishlists.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            <XIcon className="size-4 mr-2" />
            Cancel
          </AlertDialogCancel>
          <DeleteItemDialogAction itemId={item.id} />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

type DeleteItemDialogActionProps = {
  itemId: string;
};

function DeleteItemDialogAction({ itemId }: DeleteItemDialogActionProps) {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();

      return await new ClientRequester().delete<undefined>(`/items/${itemId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });

      toast({
        title: "Item taken down",
        description: "Your item has been taken down successfully.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to take down item",
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
