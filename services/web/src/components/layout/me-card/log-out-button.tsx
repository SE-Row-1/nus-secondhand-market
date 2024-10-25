"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { clientRequester } from "@/query/requester/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2Icon, LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export function LogOutButton() {
  const router = useRouter();

  const { toast } = useToast();

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      return await clientRequester.delete<undefined>("/auth/token");
    },
    onSuccess: () => {
      queryClient.setQueryData(["auth", "me"], null);

      toast({ description: "Hope to see you again soon! 👋" });

      router.push("/login");
      router.refresh();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        description: error.message,
      });
    },
  });

  return (
    <DropdownMenuItem onSelect={(event) => event.preventDefault()} asChild>
      <button
        type="button"
        disabled={isPending}
        onClick={() => mutate()}
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
