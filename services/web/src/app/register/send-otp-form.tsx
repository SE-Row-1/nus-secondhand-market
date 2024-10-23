"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { clientRequester } from "@/utils/requester/client";
import { useMutation } from "@tanstack/react-query";
import { Loader2Icon, MailIcon } from "lucide-react";
import { useState, type Dispatch, type FormEvent } from "react";
import * as v from "valibot";
import type { RegistrationAction } from "./reducer";

const formSchema = v.object({
  email: v.pipe(
    v.string("Email should be a string"),
    v.email("Invalid email address"),
    v.endsWith(
      "@u.nus.edu",
      'Email should be a NUS email that ends with "@u.nus.edu"',
    ),
  ),
});

type Props = {
  dispatch: Dispatch<RegistrationAction>;
};

export function SendOtpForm({ dispatch }: Props) {
  const [email, setEmail] = useState("");

  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationFn: async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const { email } = await v.parseAsync(
        formSchema,
        Object.fromEntries(new FormData(event.target as HTMLFormElement)),
      );

      setEmail(email);

      return await clientRequester.post<number>("/auth/otp", {
        type: "register",
        email,
      });
    },
    onSuccess: (transactionId) => {
      toast({
        description:
          "We have sent a 6-digit OTP to your email. Please check your inbox.",
      });

      dispatch({ type: "SEND_OTP_TO_VERIFY_OTP", email, transactionId });
    },
    onError: (error) => {
      toast({ variant: "destructive", description: error.message });
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
