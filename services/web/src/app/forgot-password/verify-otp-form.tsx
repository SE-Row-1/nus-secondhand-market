import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { clientRequester } from "@/query/requester/client";
import { useMutation } from "@tanstack/react-query";
import { Loader2Icon, ShieldCheckIcon } from "lucide-react";
import type { Dispatch } from "react";
import * as v from "valibot";
import type { PasswordResetAction, PasswordResetState } from "./reducer";

const formSchema = v.object({
  otp: v.pipe(
    v.string("OTP should be a string"),
    v.length(6, "OTP should be 6 characters long"),
  ),
});

type Props = {
  state: PasswordResetState;
  dispatch: Dispatch<PasswordResetAction>;
};

export function VerifyOtpForm({ state, dispatch }: Props) {
  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationFn: async (formData: FormData) => {
      const { otp } = await v.parseAsync(
        formSchema,
        Object.fromEntries(formData),
      );

      return await clientRequester.post<undefined>("/auth/otp/verification", {
        id: state.transactionId,
        otp,
      });
    },
    onSuccess: () => {
      toast({
        description: "Hey, it's you! Pick a new password as you like!",
      });

      dispatch({ type: "VERIFY_OTP_TO_NEW_PASSWORD" });
    },
    onError: (error) => {
      toast({ variant: "destructive", description: error.message });
    },
  });

  return (
    <form action={mutate} className="grid gap-4 min-w-80">
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
      <Button type="submit" disabled={isPending}>
        {isPending ? (
          <Loader2Icon className="size-4 mr-2 animate-spin" />
        ) : (
          <ShieldCheckIcon className="size-4 mr-2" />
        )}
        Verify OTP
      </Button>
    </form>
  );
}
