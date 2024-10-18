"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import type { DetailedAccount } from "@/types";
import { clientRequester } from "@/utils/requester/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2Icon, UserRoundPlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent } from "react";
import * as v from "valibot";

const formSchema = v.object({
  email: v.pipe(
    v.string("Email should be a text string."),
    v.email("Email format is invalid."),
    v.endsWith("@u.nus.edu", "Email should be a NUS email address."),
  ),
  password: v.pipe(
    v.string("Password should be a text string."),
    v.minLength(8, "Password should be at least 8 characters long."),
    v.maxLength(20, "Password should be at most 20 characters long."),
  ),
  confirmation: v.pipe(
    v.string("Password should be a text string."),
    v.minLength(8, "Password should be at least 8 characters long."),
    v.maxLength(20, "Password should be at most 20 characters long."),
  ),
});

export function RegisterForm() {
  const router = useRouter();

  const { toast } = useToast();

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const target = event.target as HTMLFormElement;
      const formData = Object.fromEntries(new FormData(target));

      const { email, password, confirmation } = v.parse(formSchema, formData);

      if (password !== confirmation) {
        throw new Error("Passwords do not match. Please double check.");
      }

      return await clientRequester.post<DetailedAccount>("/accounts", {
        email,
        password,
      });
    },
    onSuccess: (account) => {
      queryClient.setQueryData(["auth", "me"], account);
      toast({
        title: "Registration success",
        description: `Welcome on board, ${account.email}!`,
      });
      router.push("/");
      router.refresh();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.message,
      });
    },
  });

  return (
    <form onSubmit={mutate} className="grid gap-4 min-w-80">
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
        <Label htmlFor="password">Password</Label>
        <Input
          type="password"
          name="password"
          required
          placeholder="8-20 characters"
          id="password"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="confirmation">Confirm password</Label>
        <Input
          type="password"
          name="confirmation"
          required
          placeholder="Type your password again"
          id="confirmation"
        />
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? (
          <Loader2Icon className="size-4 mr-2 animate-spin" />
        ) : (
          <UserRoundPlusIcon className="size-4 mr-2" />
        )}
        Register
      </Button>
    </form>
  );
}
