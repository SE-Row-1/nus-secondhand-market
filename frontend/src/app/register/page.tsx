import Link from "next/link";
import { RegisterForm } from "./form";

export default function RegisterPage() {
  return (
    <div className="grid place-items-center min-h-screen">
      <div className="min-w-80">
        <h1 className="mb-6 font-bold text-3xl text-center">Register</h1>
        <RegisterForm />
        <p className="mt-4 text-center text-sm">
          Don&apos;t have an account?&nbsp;
          <Link href="#" className="underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
