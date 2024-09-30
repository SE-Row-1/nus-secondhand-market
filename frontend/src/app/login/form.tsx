"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { Account } from "@/types";
import { ClientRequester } from "@/utils/requester/client";
import { Loader2Icon, LogInIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent } from "react";
import useSWRMutation from "swr/mutation";
import * as v from "valibot";

const formSchema = v.object({
  email: v.pipe(
    v.string("Email should be a text string."),
    v.email("Email format is invalid."),
  ),
  password: v.pipe(
    v.string("Password should be a text string."),
    v.minLength(8, "Password should be at least 8 characters long."),
    v.maxLength(20, "Password should be at most 20 characters long."),
  ),
});

export function LoginForm() {
  const router = useRouter();

  const { toast } = useToast();

  const { trigger, isMutating } = useSWRMutation<
    Account,
    Error,
    string,
    FormEvent<HTMLFormElement>
  >(
    "/auth/me",
    async (_, { arg: event }) => {
      event.preventDefault();

      const formData = Object.fromEntries(new FormData(event.currentTarget));

      const { email, password } = v.parse(formSchema, formData);

      return await new ClientRequester().post<Account>("auth/token", {
        email,
        password,
      });
    },
    {
      revalidate: false,
      populateCache: true,
      onSuccess: (account) => {
        toast({
          title: "Login successful",
          description: `Welcome back, ${account.nickname ?? account.email}!`,
        });
        router.push("/");
      },
      throwOnError: false,
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: error.message,
        });
      },
    },
  );

  return (
    <form onSubmit={trigger} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          name="email"
          required
          placeholder="e1234567@u.nus.edu"
          id="email"
        />
      </div>
      <div className="grid gap-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="password">Password</Label>
          <Link href="#" className="text-sm underline">
            Forgot your password?
          </Link>
        </div>
        <Input type="password" name="password" required id="password" />
      </div>
      <Button type="submit" disabled={isMutating} className="w-full">
        {isMutating ? (
          <Loader2Icon className="size-4 mr-2 animate-spin" />
        ) : (
          <LogInIcon className="size-4 mr-2" />
        )}
        Log in
      </Button>
    </form>
  );
}
