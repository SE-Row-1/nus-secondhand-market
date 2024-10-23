"use client";

import { useRouter } from "next/navigation";
import { useEffect, useReducer } from "react";
import { NewPasswordForm } from "./new-password-form";
import { PasswordResetStep, reducer } from "./reducer";
import { SendOtpForm } from "./send-otp-form";
import { VerifyOtpForm } from "./verify-otp-form";

export function Form() {
  const [state, dispatch] = useReducer(reducer, {
    step: PasswordResetStep.SendOtp,
    transactionId: "",
    email: "",
  });

  const router = useRouter();

  useEffect(() => {
    if (state.step === PasswordResetStep.Completed) {
      router.push("/login");
    }
  }, [state.step, router]);

  if (state.step === PasswordResetStep.SendOtp) {
    return <SendOtpForm dispatch={dispatch} />;
  }

  if (state.step === PasswordResetStep.VerifyOtp) {
    return <VerifyOtpForm state={state} dispatch={dispatch} />;
  }

  return <NewPasswordForm state={state} dispatch={dispatch} />;
}
