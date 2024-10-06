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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2Icon, SaveIcon } from "lucide-react";
import { type FormEvent } from "react";
import * as v from "valibot";

const formSchema = v.object({
  email: v.pipe(
    v.string("Email should be a text string."),
    v.endsWith("@u.nus.edu", "Email should be a NUS email address."),
  ),
});

type Props = {
  initialEmail: string;
};

export function UpdateEmailCard({ initialEmail }: Props) {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const target = event.target as HTMLFormElement;
      const formData = Object.fromEntries(new FormData(target));

      const { email } = v.parse(formSchema, formData);

      return await new ClientRequester().patch<Account>("/auth/me", {
        email,
      });
    },
    onSuccess: (account) => {
      queryClient.setQueryData(["auth", "me"], account);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to update Email",
        description: error.message,
      });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email</CardTitle>
        <CardDescription>
          Your NUS email address, used for identity verification and login.
        </CardDescription>
      </CardHeader>
      <form onSubmit={mutate}>
        <CardContent>
          <Input
            type="email"
            name="email"
            required
            defaultValue={initialEmail}
            placeholder="e1234567@u.nus.edu"
            id="email"
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
