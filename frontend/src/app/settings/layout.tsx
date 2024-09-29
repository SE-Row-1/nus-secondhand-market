import type { PropsWithChildren } from "react";
import { NavLink } from "./nav-link";

export default function SettingsLayout({ children }: PropsWithChildren) {
  return (
    <div className="max-w-6xl p-4 md:p-10 mx-auto">
      <h1 className="my-4 md:my-8 font-semibold text-3xl">Settings</h1>
      <div className="grid md:grid-cols-[180px_1fr] items-start gap-6">
        <nav
          aria-label="Settings navigation"
          className="grid gap-4 text-sm text-muted-foreground"
        >
          <NavLink href="/settings">Account</NavLink>
          <NavLink href="/settings/display">Display</NavLink>
          <NavLink href="/settings/contacts">Contacts</NavLink>
        </nav>
        {children}
      </div>
    </div>
  );
}
