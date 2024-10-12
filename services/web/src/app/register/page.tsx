import type { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "./form";

export default function RegisterPage() {
  return (
    <div className="grow flex flex-col justify-center items-center gap-4">
      <h1 className="font-bold text-3xl">Register</h1>
      <RegisterForm />
      <p className="text-sm">
        Already have an account?&nbsp;
        <Link href="/login" className="underline">
          Log in
        </Link>
      </p>
    </div>
  );
}

export const metadata: Metadata = {
  title: "Register",
};
