import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { LogInForm } from "./form";

export default function LogInPage() {
  return (
    <div className="grow grid place-items-center">
      <div className="min-w-80">
        <h1 className="mb-6 font-bold text-3xl text-center">Log in</h1>
        <Suspense>
          <LogInForm />
        </Suspense>
        <p className="mt-4 text-sm text-center">
          Don&apos;t have an account?&nbsp;
          <Link href="/register" className="underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: "Log in",
};
