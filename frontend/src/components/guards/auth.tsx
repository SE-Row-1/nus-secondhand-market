import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { PropsWithChildren } from "react";

export function AuthGuard({ children }: PropsWithChildren) {
  const isAuthenticated = cookies().has("access_token");

  if (!isAuthenticated) {
    redirect("/login");
  }

  return children;
}
