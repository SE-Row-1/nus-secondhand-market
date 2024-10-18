"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import type { DetailedAccount } from "@/types";
import { clientRequester } from "@/utils/requester/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2Icon, UserRoundPlusIcon } from "lucide-react";
import type { FormEvent } from "react";
import * as v from "valibot";

const formSchema = v.object({
  password: v.pipe(
    v.string("Password should be a string"),
    v.minLength(8, "Password should be at least 8 characters long"),
    v.maxLength(20, "Password should be at most 20 characters long"),
  ),
  passwordConfirmation: v.pipe(
    v.string("Password should be a string"),
    v.minLength(8, "Password should be at least 8 characters long"),
    v.maxLength(20, "Password should be at most 20 characters long"),
  ),
  nickname: v.pipe(
    v.string("Nickname should be a string"),
    v.minLength(2, "Nickname should be at least 2 characters long"),
    v.maxLength(20, "Nickname should be at most 20 characters long"),
  ),
});

type Props = {
  email: string;
  progressToNextStep: () => void;
};

export function InfoForm({ email, progressToNextStep }: Props) {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const { password, passwordConfirmation, nickname } = await v.parseAsync(
        formSchema,
        Object.fromEntries(new FormData(event.target as HTMLFormElement)),
      );

      if (password !== passwordConfirmation) {
        throw new Error("Passwords do not match. Please double check.");
      }

      return await clientRequester.post<DetailedAccount>("/accounts", {
        email,
        password,
        nickname,
      });
    },
    onSuccess: (account) => {
      queryClient.setQueryData(["auth", "me"], account);

      progressToNextStep();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to register",
        description: error.message,
      });
    },
  });

  return (
    <form onSubmit={mutate} className="grid gap-4 min-w-80">
      <div className="grid gap-2">
        <Label showRequiredMarker htmlFor="password">
          Password
        </Label>
        <Input
          type="password"
          name="password"
          required
          placeholder="8-20 characters"
          id="password"
        />
      </div>
      <div className="grid gap-2">
        <Label showRequiredMarker htmlFor="passwordConfirmation">
          Confirm password
        </Label>
        <Input
          type="password"
          name="passwordConfirmation"
          required
          placeholder="Type your password again"
          id="passwordConfirmation"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="nickname">Nickname</Label>
        <Input
          type="text"
          name="nickname"
          placeholder="2-20 characters"
          id="nickname"
        />
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? (
          <Loader2Icon className="size-4 mr-2 animate-spin" />
        ) : (
          <UserRoundPlusIcon className="size-4 mr-2" />
        )}
        Finish
      </Button>
    </form>
  );
}
