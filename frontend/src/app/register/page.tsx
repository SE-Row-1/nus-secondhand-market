import { NoAuthGuard } from "@/components/guards/no-auth";
import Link from "next/link";
import { RegisterForm } from "./form";

export default function RegisterPage() {
  return (
    <NoAuthGuard>
      <div className="grid place-items-center min-h-[calc(100vh-64px)]">
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
    </NoAuthGuard>
  );
}
