import type { Metadata } from "next";
import { MultiSteps } from "./multi-steps";

export default function RegisterPage() {
  return (
    <div className="grow flex flex-col justify-center items-center gap-4">
      <h1 className="mb-2 font-bold text-3xl">Register</h1>
      <MultiSteps />
    </div>
  );
}

export const metadata: Metadata = {
  title: "Register",
};
