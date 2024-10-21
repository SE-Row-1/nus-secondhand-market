"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { useMe } from "@/hooks/use-me";
import type { DetailedAccount } from "@/types";
import type { ReactNode } from "react";
import { LogOutButton } from "./log-out-button";

type Props = {
  initialMe: DetailedAccount;
  noAuthFallback: ReactNode;
};

export function MeCardClient({ initialMe, noAuthFallback }: Props) {
  const { data: me } = useMe(initialMe);

  if (!me) {
    return noAuthFallback;
  }

  const nickname = me.nickname ?? me.email.replace(/@.+$/, "");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton size="lg">
          <Avatar className="size-8">
            <AvatarImage src={me.avatar_url ?? undefined} alt="Your avatar" />
            <AvatarFallback>{nickname[0]}</AvatarFallback>
          </Avatar>
          <div className="grow">
            <p className="font-medium text-sm truncate">{nickname}</p>
            <p className="text-xs text-muted-foreground truncate">{me.email}</p>
          </div>
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-60">
        <DropdownMenuLabel>Hi, {nickname}! 👋</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <LogOutButton />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
