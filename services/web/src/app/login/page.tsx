import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { LogInForm } from "./form";

export default function LogInPage() {
  return (
    <div className="grow flex flex-col justify-center items-center gap-4">
      <h1 className="font-bold text-3xl">Log in</h1>
      <Suspense>
        <LogInForm />
      </Suspense>
      <p className="text-sm">
        Don&apos;t have an account?&nbsp;
        <Link href="/register" className="underline">
          Register
        </Link>
      </p>
    </div>
  );
}

export const metadata: Metadata = {
  title: "Log in",
};
