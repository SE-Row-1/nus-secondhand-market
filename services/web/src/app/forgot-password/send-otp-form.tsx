"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { clientRequester } from "@/utils/requester/client";
import { useMutation } from "@tanstack/react-query";
import { Loader2Icon, MailIcon } from "lucide-react";
import { useState, type Dispatch } from "react";
import * as v from "valibot";
import type { PasswordResetAction } from "./reducer";

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
  dispatch: Dispatch<PasswordResetAction>;
};

export function SendOtpForm({ dispatch }: Props) {
  const [email, setEmail] = useState("");

  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationFn: async (formData: FormData) => {
      const { email } = await v.parseAsync(
        formSchema,
        Object.fromEntries(formData),
      );

      setEmail(email);

      return await clientRequester.post<string>("/auth/otp", {
        type: "reset_password",
        email,
      });
    },
    onSuccess: (transactionId) => {
      toast({
        description:
          "Don't worry, we know you! Please check your inbox for a 6-digit OTP.",
      });

      dispatch({ type: "SEND_OTP_TO_VERIFY_OTP", email, transactionId });
    },
    onError: (error) => {
      toast({ variant: "destructive", description: error.message });
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
