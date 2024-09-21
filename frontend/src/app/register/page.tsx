import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserRoundPlusIcon } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="grid place-items-center min-h-screen">
      <div className="min-w-80">
        <h1 className="mb-6 font-bold text-3xl text-center">Register</h1>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              name="email"
              required
              placeholder="e1234567@u.nus.edu"
              id="email"
            />
          </div>
          <div className="grid gap-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password">Password</Label>
              <Link href="#" className="text-sm underline">
                Forgot your password?
              </Link>
            </div>
            <Input
              type="password"
              name="password"
              required
              minLength={8}
              maxLength={20}
              placeholder="8-20 characters"
              id="password"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirmation">Confirm password</Label>
            <Input
              type="password"
              name="confirmation"
              required
              minLength={8}
              maxLength={20}
              placeholder="Type your password again"
              id="confirmation"
            />
          </div>
          <Button type="submit" className="w-full">
            <UserRoundPlusIcon className="size-4 mr-2" />
            Register
          </Button>
        </div>
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
