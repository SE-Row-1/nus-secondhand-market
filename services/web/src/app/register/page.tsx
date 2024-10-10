import type { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "./form";

export const metadata: Metadata = {
  title: "Register",
};

export default function RegisterPage() {
  return (
    <div className="grid place-items-center min-h-screen">
      <div className="min-w-80">
        <h1 className="mb-6 font-bold text-3xl text-center">Register</h1>
        <RegisterForm />
        <p className="mt-4 text-sm text-center">
          Already have an account?&nbsp;
          <Link href="/login" className="underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
