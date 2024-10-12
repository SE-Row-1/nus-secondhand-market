"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { PropsWithChildren } from "react";
import { cn } from "../ui/utils";

type Props = PropsWithChildren<{
  href: Route;
}>;

export function NavLink({ children, href }: Props) {
  const pathname = usePathname();

  const isActive = href === "/" ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-sm transition-colors",
        isActive
          ? "bg-muted text-primary"
          : "text-muted-foreground hover:text-primary",
      )}
    >
      {children}
    </Link>
  );
}
