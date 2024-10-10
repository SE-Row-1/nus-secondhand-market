import type { PropsWithChildren } from "react";
import { NavLink } from "./nav-link";

export default function SettingsLayout({ children }: PropsWithChildren) {
  return (
    <>
      <div className="space-y-4 mt-4 md:mt-8 mb-8">
        <h1 className="font-bold text-3xl">Settings</h1>
        <p className="text-muted-foreground">
          Personalize your profile and preferences.
        </p>
      </div>
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
    </>
  );
}
