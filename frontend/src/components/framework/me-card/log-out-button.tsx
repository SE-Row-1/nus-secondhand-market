"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { ClientRequester } from "@/utils/requester/client";
import { Loader2Icon, LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import type { MouseEvent } from "react";
import useSWRMutation from "swr/mutation";

export function LogOutButton() {
  const router = useRouter();

  const { toast } = useToast();

  const { trigger, isMutating } = useSWRMutation<
    undefined,
    Error,
    string,
    MouseEvent<HTMLButtonElement>
  >(
    "auth/me",
    async () => {
      return await new ClientRequester().delete<undefined>("auth/token");
    },
    {
      populateCache: true,
      revalidate: false,
      onSuccess: () => {
        toast({
          title: "Logged out successfully",
          description: "Hope to see you again soon! 👋",
        });
        router.push("/login");
      },
      throwOnError: false,
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Failed to log out",
          description: error.message,
        });
      },
    },
  );

  return (
    <DropdownMenuItem onSelect={(event) => event.preventDefault()} asChild>
      <button
        type="button"
        disabled={isMutating}
        onClick={trigger}
        className="w-full"
      >
        {isMutating ? (
          <Loader2Icon className="size-4 mr-2 animate-spin" />
        ) : (
          <LogOutIcon className="size-4 mr-2" />
        )}
        Log out
      </button>
    </DropdownMenuItem>
  );
}
