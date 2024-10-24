import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { clientRequester } from "@/utils/requester/client";
import { useMutation } from "@tanstack/react-query";
import { Loader2Icon, ShieldCheckIcon } from "lucide-react";
import type { Dispatch, FormEvent } from "react";
import * as v from "valibot";
import type { RegistrationAction, RegistrationState } from "./reducer";

const formSchema = v.object({
  otp: v.pipe(
    v.string("OTP should be a string"),
    v.length(6, "OTP should be 6 characters long"),
  ),
});

type Props = {
  state: RegistrationState;
  dispatch: Dispatch<RegistrationAction>;
};

export function VerifyOtpForm({ state, dispatch }: Props) {
  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationFn: async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const { otp } = await v.parseAsync(
        formSchema,
        Object.fromEntries(new FormData(event.target as HTMLFormElement)),
      );

      return await clientRequester.post<undefined>("/auth/otp/verification", {
        id: state.transactionId,
        otp,
      });
    },
    onSuccess: () => {
      toast({
        description:
          "You have been successfully verified as a NUS student! Now just one more step to go...",
      });

      dispatch({ type: "VERIFY_OTP_TO_FILL_INFO" });
    },
    onError: (error) => {
      toast({ variant: "destructive", description: error.message });
    },
  });

  return (
    <form onSubmit={mutate} className="grid gap-4 min-w-80">
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