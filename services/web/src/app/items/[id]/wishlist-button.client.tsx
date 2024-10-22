"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import type { Item } from "@/types";
import { clientRequester } from "@/utils/requester/client";
import { useMutation } from "@tanstack/react-query";
import { HeartIcon, HeartOffIcon, Loader2Icon } from "lucide-react";
import { useState } from "react";

type Props = {
  item: Item;
  meId: number;
  initialIsInWishlist: boolean;
};

export function WishlistButtonClient({
  item,
  meId,
  initialIsInWishlist,
}: Props) {
  const [isInWishlist, setIsInWishlist] = useState(initialIsInWishlist);

  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (isInWishlist) {
        return await clientRequester.delete<undefined>(
          `/wishlists/${meId}/items/${item.id}`,
        );
      }

      return await clientRequester.post<undefined>(
        `/wishlists/${meId}/items/${item.id}`,
        item,
      );
    },
    onSuccess: () => {
      setIsInWishlist((isInWishlist) => !isInWishlist);
    },
    onError: (error) => {
      toast({ variant: "destructive", description: error.message });
    },
  });

  return (
    <Button disabled={isPending} onClick={() => mutate()}>
      {isPending ? (
        <Loader2Icon className="size-4 mr-2 animate-spin" />
      ) : isInWishlist ? (
        <HeartOffIcon className="size-4 mr-2" />
      ) : (
        <HeartIcon className="size-4 mr-2" />
      )}
      {isInWishlist ? "No longer want it" : "Want it"}
    </Button>
  );
}
