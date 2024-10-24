"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useItem, useMe, useWishlistEntry } from "@/query/browser";
import { clientRequester } from "@/query/requester/client";
import { ItemType, type WishlistEntry } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { HeartIcon, HeartOffIcon, Loader2Icon } from "lucide-react";
import { useParams } from "next/navigation";

export function WishlistButton() {
  const { id: itemId } = useParams<{ id: string }>();

  const { data: me } = useMe();

  const { data: item } = useItem(itemId);

  const { data: wishlistEntry } = useWishlistEntry(me?.id ?? 0, itemId);

  const queryClient = useQueryClient();

  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (!me) {
        return;
      }

      if (wishlistEntry) {
        return await clientRequester.delete<undefined>(
          `/wishlists/${me.id}/items/${itemId}`,
        );
      }

      return await clientRequester.post<undefined>(
        `/wishlists/${me.id}/items/${itemId}`,
        item,
      );
    },
    onSuccess: () => {
      queryClient.setQueryData(
        ["wishlists", me?.id, "items", itemId],
        (oldWishlistEntry: WishlistEntry) => {
          if (oldWishlistEntry) {
            return undefined;
          }

          if (!item) {
            return undefined;
          }

          if (item.type === ItemType.Single) {
            return {
              id: item.id,
              type: item.type,
              name: item.name,
              price: item.price,
              photo_urls: item.photo_urls,
              status: item.status,
              seller: item.seller,
              wanted_at: new Date().toISOString(),
            } satisfies WishlistEntry;
          }

          return {
            id: item.id,
            type: item.type,
            name: item.name,
            price: item.price,
            discount: item.discount,
            status: item.status,
            seller: item.seller,
            wanted_at: new Date().toISOString(),
          } satisfies WishlistEntry;
        },
      );
    },
    onError: (error) => {
      toast({ variant: "destructive", description: error.message });
    },
  });

  return (
    <Button disabled={isPending} onClick={() => mutate()}>
      {isPending ? (
        <Loader2Icon className="size-4 mr-2 animate-spin" />
      ) : wishlistEntry ? (
        <HeartOffIcon className="size-4 mr-2" />
      ) : (
        <HeartIcon className="size-4 mr-2" />
      )}
      {wishlistEntry ? "No longer want it" : "Want it"}
    </Button>
  );
}
