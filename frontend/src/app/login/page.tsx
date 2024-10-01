import { NoAuthGuard } from "@/components/guards/no-auth";
import Link from "next/link";
import { LoginForm } from "./form";

export default function LoginPage() {
  return (
    <NoAuthGuard>
      <div className="grid place-items-center min-h-screen">
        <div className="min-w-80">
          <h1 className="mb-6 font-bold text-3xl text-center">Log in</h1>
          <LoginForm />
          <p className="mt-4 text-sm text-center">
            Don&apos;t have an account?&nbsp;
            <Link href="/register" className="underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </NoAuthGuard>
  );
}
