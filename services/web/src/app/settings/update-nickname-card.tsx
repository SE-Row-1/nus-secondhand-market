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
import { useMe } from "@/query/browser";
import { clientRequester } from "@/query/requester/client";
import type { DetailedAccount } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2Icon, SaveIcon } from "lucide-react";
import * as v from "valibot";

const formSchema = v.object({
  nickname: v.pipe(
    v.string("Nickname should be a text string."),
    v.minLength(2, "Nickname should be at least 2 characters long."),
    v.maxLength(20, "Nickname should be at most 20 characters long."),
  ),
});

export function UpdateNicknameCard() {
  const { data: me } = useMe();

  const { toast } = useToast();

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (formData: FormData) => {
      if (!me) {
        return null;
      }

      const { nickname } = await v.parseAsync(
        formSchema,
        Object.fromEntries(formData),
      );

      return await clientRequester.patch<DetailedAccount>(
        `/accounts/${me.id}`,
        { nickname },
      );
    },
    onSuccess: (account) => {
      queryClient.setQueryData(["auth", "me"], account);

      toast({ description: "Update success" });
    },
    onError: (error) => {
      toast({ variant: "destructive", description: error.message });
    },
  });

  if (!me) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nickname</CardTitle>
        <CardDescription>
          Your preferred name, displayed to everyone else on the platform.
        </CardDescription>
      </CardHeader>
      <form action={mutate}>
        <CardContent>
          <Input
            type="text"
            name="nickname"
            required
            defaultValue={me.nickname ?? ""}
            placeholder="2-20 characters"
            id="nickname"
          />
        </CardContent>
        <CardFooter>
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
