"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { EmailForm } from "./email-form";
import { InfoForm } from "./info-form";
import { OtpForm } from "./otp-form";

enum Step {
  Email = 1,
  OTP,
  Info,
}

export function MultiSteps() {
  const [step, setStep] = useState(Step.Email);

  const [email, setEmail] = useState<string>("");

  const router = useRouter();

  if (step === Step.Email) {
    return (
      <>
        <EmailForm
          progressToNextStep={() => setStep(Step.OTP)}
          storeEmail={setEmail}
        />
        <p className="text-sm">
          Already have an account?&nbsp;
          <Link href="/login" className="underline">
            Log in
          </Link>
        </p>
      </>
    );
  }

  if (step === Step.OTP) {
    return <OtpForm progressToNextStep={() => setStep(Step.Info)} />;
  }

  return (
    <InfoForm
      email={email}
      progressToNextStep={() => {
        router.refresh();
        router.push("/");
      }}
    />
  );
}
