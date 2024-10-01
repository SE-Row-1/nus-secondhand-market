"use client";

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
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ClientRequester } from "@/utils/requester/client";
import { CheckIcon, Loader2Icon, TrashIcon, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import type { MouseEvent } from "react";
import useSWRMutation from "swr/mutation";

export function DeleteAccountCard() {
  return (
    <Card className="border-destructive">
      <CardHeader>
        <CardTitle className="text-destructive">Delete account</CardTitle>
        <CardDescription className="leading-relaxed">
          Delete your account and all of its data on this platform.
          <br />
          This includes your profile, items, wishlist, transaction history and
          settings.
          <br />
          You will be asked to confirm this action, but anyway proceed with
          caution.
        </CardDescription>
      </CardHeader>
      <CardFooter className="border-t px-6 py-4">
        <DeleteAccountDialog />
      </CardFooter>
    </Card>
  );
}

function DeleteAccountDialog() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="bg-destructive">
          <TrashIcon className="size-4 mr-2" />
          Request to delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription className="space-y-1.5">
            <span className="inline-block">
              Your account will immediately be deactivated. But for safety
              reasons, we will keep your data for another 30 days before
              permanently deleting it.
            </span>
            <span className="inline-block">
              If you change your mind during this period, you can cancel the
              deletion by contacting our support team.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            <XIcon className="size-4 mr-2" />
            Cancel
          </AlertDialogCancel>
          <DeleteAccountButton />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function DeleteAccountButton() {
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
      await new ClientRequester().delete("auth/me");
    },
    {
      revalidate: false,
      populateCache: () => undefined,
      onSuccess: () => {
        toast({
          title: "Account deactivated",
          description:
            "We are sorry to see you go. 🥲 Remember you can contact our support team to find your account back in the next 30 days!",
        });
        router.push("/");
      },
      throwOnError: false,
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Failed to delete account",
          description: error.message,
        });
      },
    },
  );

  return (
    <AlertDialogAction disabled={isMutating} onClick={trigger}>
      {isMutating ? (
        <Loader2Icon className="size-4 mr-2 animate-spin" />
      ) : (
        <CheckIcon className="size-4 mr-2" />
      )}
      Continue
    </AlertDialogAction>
  );
}
