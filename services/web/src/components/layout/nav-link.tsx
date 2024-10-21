"use client";

import { Collapsible } from "@radix-ui/react-collapsible";
import { ChevronRightIcon } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "../ui/sidebar";

type Props = {
  icon: ReactNode;
  title: string;
  to: Route;
  subLinks?: {
    title: string;
    to: Route;
  }[];
};

export function NavLink({ icon, title, to, subLinks }: Props) {
  const pathname = usePathname();

  const isActive = to === "/" ? pathname === to : pathname.startsWith(to);

  if (!subLinks) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton isActive={isActive} tooltip={title} asChild>
          <Link href={to}>
            {icon}
            <span>{title}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <Collapsible defaultOpen={isActive} asChild>
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={title}>
            {icon}
            <span>{title}</span>
            <ChevronRightIcon className="absolute right-1 size-4 group-data-[state=open]/menu-item:rotate-90 transition-transform" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {subLinks.map(({ title, to }) => (
              <SidebarMenuSubItem key={to}>
                <SidebarMenuSubButton isActive={to === pathname} asChild>
                  <Link href={to}>
                    <span>{title}</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}
