import type { Metadata } from "next";
import { Form } from "./form";

export default function ForgotPasswordPage() {
  return (
    <div className="grow flex flex-col justify-center items-center gap-4">
      <h1 className="mb-2 font-bold text-3xl">Reset Password</h1>
      <Form />
    </div>
  );
}

export const metadata: Metadata = {
  title: "Reset password",
};
