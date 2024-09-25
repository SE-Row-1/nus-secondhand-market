"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePostRequest } from "@/hooks/use-request";
import { useToast } from "@/hooks/use-toast";
import type { Account } from "@/types";
import { UserRoundPlusIcon } from "lucide-react";
import Link from "next/link";
import { type FormEvent } from "react";
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
  confirmation: v.pipe(
    v.string("Password should be a text string."),
    v.minLength(8, "Password should be at least 8 characters long."),
    v.maxLength(20, "Password should be at most 20 characters long."),
  ),
});

export function RegisterForm() {
  const { trigger } = usePostRequest<
    { email: string; password: string },
    Account & { access_token: string }
  >("/auth/me");

  const { toast } = useToast();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = Object.fromEntries(new FormData(event.currentTarget));

    const { success, output, issues } = v.safeParse(formSchema, formData);

    if (!success) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: issues[0].message,
      });

      return;
    }

    const { email, password, confirmation } = output;

    if (password !== confirmation) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: "Passwords do not match. Please double check.",
      });

      return;
    }

    const { access_token, ...account } = await trigger({ email, password });

    console.log(account);

    localStorage.setItem("access_token", access_token);
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
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
      <Button type="submit" className="w-full">
        <UserRoundPlusIcon className="size-4 mr-2" />
        Register
      </Button>
    </form>
  );
}
