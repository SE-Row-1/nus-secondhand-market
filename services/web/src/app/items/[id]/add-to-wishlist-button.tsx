"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useMe } from "@/hooks/use-me";
import type { Item, SimplifiedAccount } from "@/types";
import { clientRequester } from "@/utils/requester/client";
import { useMutation } from "@tanstack/react-query";
import { HeartIcon, HeartOffIcon, Loader2Icon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState, type MouseEvent } from "react";

type Props = {
  item: Item<SimplifiedAccount>;
  initialIsInWishlist: boolean;
};

export function AddToWishListButton({ item, initialIsInWishlist }: Props) {
  const { data: me } = useMe();

  const [isInWishlist, setIsInWishlist] = useState(initialIsInWishlist);

  const router = useRouter();

  const pathname = usePathname();

  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationFn: async (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();

      if (!me) {
        const searchParams = new URLSearchParams();
        searchParams.set("next", pathname);
        router.push(`/login?${searchParams.toString()}`);
        return;
      }

      if (isInWishlist) {
        return await clientRequester.delete<undefined>(
          `/wishlists/${me.id}/items/${item.id}`,
        );
      }

      return await clientRequester.post(
        `/wishlists/${me.id}/items/${item.id}`,
        item,
      );
    },
    onSuccess: () => {
      setIsInWishlist((isInWishlist) => !isInWishlist);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error occurred",
        description: error.message,
      });
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
