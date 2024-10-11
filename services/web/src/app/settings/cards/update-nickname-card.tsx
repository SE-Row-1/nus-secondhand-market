"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import type { Account } from "@/types";
import { clientRequester } from "@/utils/requester/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2Icon, SaveIcon } from "lucide-react";
import { type FormEvent } from "react";
import * as v from "valibot";

const formSchema = v.object({
  nickname: v.pipe(
    v.string("Nickname should be a text string."),
    v.minLength(2, "Nickname should be at least 2 characters long."),
    v.maxLength(20, "Nickname should be at most 20 characters long."),
  ),
});

type Props = {
  initialNickname: string | null;
};

export function UpdateNicknameCard({ initialNickname }: Props) {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const target = event.target as HTMLFormElement;
      const formData = Object.fromEntries(new FormData(target));

      const { nickname } = v.parse(formSchema, formData);

      return await clientRequester.patch<Account>("/auth/me", { nickname });
    },
    onSuccess: (account) => {
      queryClient.setQueryData(["auth", "me"], account);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to update nickname",
        description: error.message,
      });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nickname</CardTitle>
        <CardDescription>
          Your preferred name, displayed to everyone else on the platform.
        </CardDescription>
      </CardHeader>
      <form onSubmit={mutate}>
        <CardContent>
          <Input
            type="text"
            name="nickname"
            required
            defaultValue={initialNickname ?? ""}
            placeholder="2-20 characters"
            id="nickname"
          />
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button disabled={isPending} type="submit">
            {isPending ? (
              <Loader2Icon className="size-4 mr-2 animate-spin" />
            ) : (
              <SaveIcon className="size-4 mr-2" />
            )}
            Save
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
