"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { clientRequester } from "@/query/requester/client";
import type { DetailedAccount } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2Icon, LogInIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
});

export function LogInForm() {
  const router = useRouter();

  const { toast } = useToast();

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (formData: FormData) => {
      const { email, password } = await v.parseAsync(
        formSchema,
        Object.fromEntries(formData),
      );

      return await clientRequester.post<DetailedAccount>("/auth/token", {
        email,
        password,
      });
    },
    onSuccess: (account) => {
      queryClient.setQueryData(["auth", "me"], account);

      toast({
        title: "Log in successful",
        description: `Welcome back, ${account.nickname ?? account.email}!`,
      });

      router.push("/");
      router.refresh();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Log in failed",
        description: error.message,
      });
    },
  });

  return (
    <form action={mutate} className="grid gap-4 min-w-80">
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
          <Link href="/forgot-password" className="text-sm underline">
            Forgot your password?
          </Link>
        </div>
        <Input type="password" name="password" required id="password" />
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? (
          <Loader2Icon className="size-4 mr-2 animate-spin" />
        ) : (
          <LogInIcon className="size-4 mr-2" />
        )}
        Log in
      </Button>
    </form>
  );
}
