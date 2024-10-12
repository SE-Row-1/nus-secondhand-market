import { PageTitle } from "@/components/framework/page-title";
import type { PropsWithChildren } from "react";
import { NavLink } from "./nav-link";

export default function SettingsLayout({ children }: PropsWithChildren) {
  return (
    <>
      <PageTitle
        title="Settings"
        description="Manage your profile and account"
        className="mb-8"
      />
      <div className="flex flex-col md:flex-row gap-8 md:gap-24 xl:gap-40">
        <nav
          aria-label="Settings navigation"
          className="self-start grid gap-4 text-sm text-muted-foreground"
        >
          <NavLink href="/settings">Account</NavLink>
          <NavLink href="/settings/display">Display</NavLink>
          <NavLink href="/settings/contacts">Contacts</NavLink>
        </nav>
        <div className="grow">{children}</div>
      </div>
    </>
  );
}
