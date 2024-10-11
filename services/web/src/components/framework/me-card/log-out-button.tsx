"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { ClientRequester } from "@/utils/requester/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2Icon, LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import type { MouseEvent } from "react";

export function LogOutButton() {
  const router = useRouter();

  const { toast } = useToast();

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      return await new ClientRequester().delete<undefined>("/auth/token");
    },
    onSuccess: () => {
      queryClient.setQueryData(["auth", "me"], null);

      toast({
        title: "Logged out successfully",
        description: "Hope to see you again soon! 👋",
      });

      router.push("/login");
      router.refresh();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to log out",
        description: error.message,
      });
    },
  });

  return (
    <DropdownMenuItem onSelect={(event) => event.preventDefault()} asChild>
      <button
        type="button"
        disabled={isPending}
        onClick={mutate}
        className="w-full"
      >
        {isPending ? (
          <Loader2Icon className="size-4 mr-2 animate-spin" />
        ) : (
          <LogOutIcon className="size-4 mr-2" />
        )}
        Log out
      </button>
    </DropdownMenuItem>
  );
}
