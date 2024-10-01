import { AuthGuard } from "@/components/guards/auth";
import type { PropsWithChildren } from "react";
import { NavLink } from "./nav-link";

export default function SettingsLayout({ children }: PropsWithChildren) {
  return (
    <AuthGuard>
      <h1 className="my-4 md:my-8 font-semibold text-3xl">Settings</h1>
      <div className="flex flex-col md:flex-row gap-6 md:gap-24 xl:gap-40">
        <nav
          aria-label="Settings navigation"
          className="self-start grid gap-4 text-sm text-muted-foreground"
        >
          <NavLink href="/settings">Account</NavLink>
          <NavLink href="/settings/display">Display</NavLink>
          <NavLink href="/settings/contacts">Contacts</NavLink>
        </nav>
        <div className="grow self-stretch">{children}</div>
      </div>
    </AuthGuard>
  );
}
