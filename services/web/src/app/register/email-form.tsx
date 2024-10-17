"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { clientRequester } from "@/utils/requester/client";
import { useMutation } from "@tanstack/react-query";
import { Loader2Icon, MailIcon } from "lucide-react";
import { type FormEvent } from "react";
import * as v from "valibot";

const formSchema = v.object({
  email: v.pipe(
    v.string("Email should be a string"),
    v.email("Invalid email address format"),
    v.endsWith(
      "@u.nus.edu",
      'Email should be a NUS email that ends with "@u.nus.edu"',
    ),
  ),
});

type Props = {
  progressToNextStep: () => void;
  storeEmail: (email: string) => void;
};

export function EmailForm({ progressToNextStep, storeEmail }: Props) {
  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationFn: async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const { email } = await v.parseAsync(
        formSchema,
        Object.fromEntries(new FormData(event.target as HTMLFormElement)),
      );

      storeEmail(email);

      return await clientRequester.post<undefined>("/auth/otp", { email });
    },
    onSuccess: () => {
      toast({
        title: "Sent OTP",
        description:
          "We have sent an OTP to your email. Please check your inbox.",
      });

      progressToNextStep();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to send OTP",
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
      <Button type="submit" disabled={isPending}>
        {isPending ? (
          <Loader2Icon className="size-4 mr-2 animate-spin" />
        ) : (
          <MailIcon className="size-4 mr-2" />
        )}
        Send OTP
      </Button>
    </form>
  );
}
