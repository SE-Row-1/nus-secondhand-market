"use client";

import { AlertDialogAction } from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { clientRequester } from "@/utils/requester/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckIcon, Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import type { MouseEvent } from "react";

type Props = {
  id: number;
};

export function DeleteAccountButton({ id }: Props) {
  const router = useRouter();

  const { toast } = useToast();

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      return await clientRequester.delete<undefined>(`/accounts/${id}`);
    },
    onSuccess: () => {
      queryClient.setQueryData(["auth", "me"], null);
      toast({
        title: "Account deactivated",
        description:
          "We are sorry to see you go. 🥲 Remember you can contact our support team to find your account back in the next 30 days!",
      });
      router.push("/");
      router.refresh();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to delete account",
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
