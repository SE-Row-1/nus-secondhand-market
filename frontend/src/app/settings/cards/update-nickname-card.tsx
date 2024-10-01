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
import { useToast } from "@/hooks/use-toast";
import type { Account } from "@/types";
import { ClientRequester } from "@/utils/requester/client";
import { Loader2Icon, SaveIcon } from "lucide-react";
import { type FormEvent } from "react";
import useSWRMutation from "swr/mutation";
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

  const { trigger, isMutating } = useSWRMutation<
    Account,
    Error,
    string,
    FormEvent<HTMLFormElement>
  >(
    "auth/me",
    async (_, { arg: event }) => {
      event.preventDefault();

      const formData = Object.fromEntries(new FormData(event.currentTarget));

      const { nickname } = v.parse(formSchema, formData);

      return await new ClientRequester().patch<Account>("auth/me", {
        nickname,
      });
    },
    {
      populateCache: true,
      revalidate: false,
      throwOnError: false,
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Failed to update nickname",
          description: error.message,
        });
      },
    },
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nickname</CardTitle>
        <CardDescription>
          Your preferred name, displayed to everyone else on the platform.
        </CardDescription>
      </CardHeader>
      <form onSubmit={trigger}>
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
          <Button disabled={isMutating} type="submit">
            {isMutating ? (
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
