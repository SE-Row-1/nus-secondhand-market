"use client";

import { Button } from "@/components/ui/button";
import { useMe } from "@/hooks/use-me";
import type { AccountPreview, SingleItem } from "@/types";
import { ClientRequester } from "@/utils/requester/client";
import { useMutation } from "@tanstack/react-query";
import { HeartIcon, HeartOffIcon, Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type MouseEvent } from "react";

type Props = {
  item: SingleItem<AccountPreview>;
  initialIsInWishlist: boolean;
};

export function AddToWishListButton({ item, initialIsInWishlist }: Props) {
  const { data: me } = useMe();

  const [isInWishlist, setIsInWishlist] = useState(initialIsInWishlist);

  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: async (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();

      if (!me) {
        router.push("/login");
        return;
      }

      if (isInWishlist) {
        return await new ClientRequester().delete<undefined>(
          `/wishlists/${me.id}/items/${item.id}`,
        );
      }

      return await new ClientRequester().post(`/wishlists/${me.id}`, item);
    },
    onSuccess: () => {
      setIsInWishlist((isInWishlist) => !isInWishlist);
    },
  });

  return (
    <Button variant="secondary" disabled={isPending} onClick={mutate}>
      {isPending ? (
        <Loader2Icon className="size-4 mr-2 animate-spin" />
      ) : isInWishlist ? (
        <HeartOffIcon className="size-4 mr-2" />
      ) : (
        <HeartIcon className="size-4 mr-2" />
      )}
      {isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
    </Button>
  );
}
