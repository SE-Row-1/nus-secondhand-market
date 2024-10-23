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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import type { DetailedAccount } from "@/types";
import { clientRequester } from "@/utils/requester/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2Icon, SendIcon, ShieldCheckIcon, XIcon } from "lucide-react";
import { useState, type FormEvent } from "react";
import * as v from "valibot";

const sendOtpFormSchema = v.object({
  email: v.pipe(
    v.string("Email should be a text string."),
    v.email("Invalid email address."),
    v.endsWith("@u.nus.edu", "Email should be a NUS email address."),
  ),
});

const verifyOtpFormSchema = v.object({
  otp: v.pipe(
    v.string("OTP should be a string"),
    v.length(6, "OTP should be 6 characters long"),
  ),
});

type Props = {
  id: number;
  initialEmail: string;
};

export function UpdateEmailCard({ id, initialEmail }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [tempEmail, setTempEmail] = useState(initialEmail);
  const [email, setEmail] = useState(initialEmail);

  const { toast } = useToast();

  const queryClient = useQueryClient();

  const { mutate: sendOtp, isPending: isSendingOtp } = useMutation({
    mutationFn: async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const { email: newEmail } = await v.parseAsync(
        sendOtpFormSchema,
        Object.fromEntries(new FormData(event.target as HTMLFormElement)),
      );

      if (newEmail === email) {
        throw new Error("You are already using this email address.");
      }

      setTempEmail(newEmail);

      return await clientRequester.post<string>("/auth/otp", {
        type: "update-email",
        email: newEmail,
      });
    },
    onSuccess: (transactionId) => {
      setIsDialogOpen(true);
      setTransactionId(transactionId);
    },
    onError: (error) => {
      toast({ variant: "destructive", description: error.message });
    },
  });

  const { mutate: verifyOtp, isPending: isVerifyingOtp } = useMutation({
    mutationFn: async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const { otp } = await v.parseAsync(
        verifyOtpFormSchema,
        Object.fromEntries(new FormData(event.target as HTMLFormElement)),
      );

      return await clientRequester.post<undefined>("/auth/otp/verification", {
        id: transactionId,
        otp,
      });
    },
    onSuccess: () => {
      updateEmail();
    },
    onError: (error) => {
      toast({ variant: "destructive", description: error.message });
    },
  });

  const { mutate: updateEmail, isPending: isUpdatingEmail } = useMutation({
    mutationFn: async () => {
      return await clientRequester.patch<DetailedAccount>(`/accounts/${id}`, {
        email: tempEmail,
      });
    },
    onSuccess: (account) => {
      queryClient.setQueryData(["auth", "me"], account);

      setIsDialogOpen(false);
      setEmail(tempEmail);
    },
    onError: (error) => {
      toast({ variant: "destructive", description: error.message });
    },
  });

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Email</CardTitle>
          <CardDescription>
            Your NUS email address, used for identity verification and login.
          </CardDescription>
        </CardHeader>
        <form onSubmit={sendOtp}>
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
          <CardFooter>
            <Button type="submit" disabled={isSendingOtp}>
              {isSendingOtp ? (
                <Loader2Icon className="size-4 mr-2 animate-spin" />
              ) : (
                <SendIcon className="size-4 mr-2" />
              )}
              Send OTP
            </Button>
          </CardFooter>
        </form>
      </Card>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify OTP</DialogTitle>
            <DialogDescription>
              We have sent a 6-digit OTP to your email. Please check your inbox.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={verifyOtp} className="grid gap-4 min-w-80">
            <div className="grid gap-2">
              <Label htmlFor="otp">One-Time Password</Label>
              <InputOTP name="otp" required maxLength={6} id="otp">
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary">
                  <XIcon className="size-4 mr-2" />
                  Close
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={isVerifyingOtp || isUpdatingEmail}
              >
                {isVerifyingOtp || isUpdatingEmail ? (
                  <Loader2Icon className="size-4 mr-2 animate-spin" />
                ) : (
                  <ShieldCheckIcon className="size-4 mr-2" />
                )}
                Verify OTP
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
