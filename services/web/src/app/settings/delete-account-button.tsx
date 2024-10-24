"use client";

import { AlertDialogAction } from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { useMe } from "@/query/browser";
import { clientRequester } from "@/query/requester/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckIcon, Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";

export function DeleteAccountButton() {
  const { data: me } = useMe();

  const router = useRouter();

  const { toast } = useToast();

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (!me) {
        return;
      }

      return await clientRequester.delete<undefined>(`/accounts/${me.id}`);
    },
    onSuccess: () => {
      queryClient.setQueryData(["auth", "me"], null);

      toast({
        description:
          "We are sorry to see you go. 🥲 Remember you can contact our support team to find your account back in the next 30 days!",
      });

      router.push("/");
      router.refresh();
    },
    onError: (error) => {
      toast({ variant: "destructive", description: error.message });
    },
  });

  return (
    <AlertDialogAction disabled={isPending} onClick={() => mutate()}>
      {isPending ? (
        <Loader2Icon className="size-4 mr-2 animate-spin" />
      ) : (
        <CheckIcon className="size-4 mr-2" />
      )}
      Continue
    </AlertDialogAction>
  );
}
