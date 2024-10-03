"use client";

import { cn } from "@/components/ui/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  href: string;
}>;

export function NavLink({ href, children }: Props) {
  const pathname = usePathname();

  const isActive = pathname === href;

  return (
    <Link href={href} className={cn(isActive && "font-semibold text-primary")}>
      {children}
    </Link>
  );
}
