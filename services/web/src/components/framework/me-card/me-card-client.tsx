"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMe } from "@/hooks/use-me";
import { LifeBuoyIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { LogOutButton } from "./log-out-button";

type Props = {
  loadingFallback: ReactNode;
  unauthFallback: ReactNode;
};

export function MeCardClient({ loadingFallback, unauthFallback }: Props) {
  const { data: me, isPending } = useMe();

  if (isPending) {
    return loadingFallback;
  }

  if (!me) {
    return unauthFallback;
  }

  const nickname = me.nickname ?? me.email.replace("@u.nus.edu", "");

  return (
    <div className="relative self-stretch flex items-center gap-3 px-4 py-3 border rounded-lg md:mt-4 bg-card hover:bg-secondary transition-colors">
      <Avatar className="size-8 lg:size-10">
        <AvatarImage src={me.avatar_url ?? undefined} alt="Your avatar" />
        <AvatarFallback>{nickname[0]}</AvatarFallback>
      </Avatar>
      <div className="grow">
        <p className="font-medium text-sm lg:text-base">{nickname}</p>
        <p className="max-w-32 lg:max-w-40 text-xs lg:text-sm text-muted-foreground overflow-hidden whitespace-nowrap text-ellipsis">
          {me.email}
        </p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger className="absolute inset-0">
          <span className="sr-only">Open user menu</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="#">
              <LifeBuoyIcon className="size-4 mr-2" />
              Support
            </Link>
          </DropdownMenuItem>
          <LogOutButton />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
