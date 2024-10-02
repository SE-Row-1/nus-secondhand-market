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

      const { email } = v.parse(formSchema, formData);

      return await new ClientRequester().patch<Account>("auth/me", {
        email,
      });
    },
    {
      populateCache: true,
      revalidate: false,
      throwOnError: false,
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Failed to update Email",
          description: error.message,
        });
      },
    },
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email</CardTitle>
        <CardDescription>
          Your NUS email address, used for identity verification and login.
        </CardDescription>
      </CardHeader>
      <form onSubmit={trigger}>
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
