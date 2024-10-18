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
import type { FormEvent } from "react";
import * as v from "valibot";

const formSchema = v.object({
  otp: v.pipe(
    v.string("OTP should be a string"),
    v.digits("OTP should only contain digits"),
    v.length(6, "OTP should be 6 characters long"),
  ),
});

type Props = {
  progressToNextStep: () => void;
};

export function OtpForm({ progressToNextStep }: Props) {
  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationFn: async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const { otp } = await v.parseAsync(
        formSchema,
        Object.fromEntries(new FormData(event.target as HTMLFormElement)),
      );

      return await clientRequester.post<undefined>("/auth/otp/verification", {
        otp,
      });
    },
    onSuccess: () => {
      toast({
        title: "OTP verified",
        description: "Hello, my NUS friend! Just one more step to go!",
      });

      progressToNextStep();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to verify OTP",
        description: error.message,
      });
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
        Verify
      </Button>
    </form>
  );
}
