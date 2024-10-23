"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useReducer } from "react";
import { FillInfoForm } from "./fill-info-form";
import { reducer, RegistrationStep } from "./reducer";
import { SendOtpForm } from "./send-otp-form";
import { VerifyOtpForm } from "./verify-otp-form";

export function Form() {
  const [state, dispatch] = useReducer(reducer, {
    step: RegistrationStep.SendOtp,
    transactionId: "",
    email: "",
  });

  const router = useRouter();

  useEffect(() => {
    if (state.step === RegistrationStep.Completed) {
      router.push("/");
    }
  }, [state.step, router]);

  if (state.step === RegistrationStep.SendOtp) {
    return (
      <>
        <SendOtpForm dispatch={dispatch} />
        <p className="text-sm">
          Already have an account?&nbsp;
          <Link href="/login" className="underline">
            Log in
          </Link>
        </p>
      </>
    );
  }

  if (state.step === RegistrationStep.VerifyOtp) {
    return <VerifyOtpForm state={state} dispatch={dispatch} />;
  }

  return <FillInfoForm state={state} dispatch={dispatch} />;
}
