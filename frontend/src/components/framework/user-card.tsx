"use client";

import type { Account } from "@/types";
import { ClientRequester } from "@/utils/requester/client";
import { LifeBuoyIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import useSWR from "swr";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { LogOutButton } from "./log-out-button";

type Props = {
  initialAccount: Account | undefined;
  fallback: ReactNode;
};

export function UserCard({ initialAccount, fallback }: Props) {
  const { data: account } = useSWR(
    "/auth/me",
    async () => {
      return await new ClientRequester().get<Account>("auth/me");
    },
    {
      fallbackData: initialAccount as Account,
      shouldRetryOnError: false,
    },
  );

  if (!account) {
    return fallback;
  }

  const nickname = account.nickname ?? account.email.replace(/@.+$/, "");

  return (
    <div className="relative self-stretch flex items-center gap-3 px-4 py-3 border rounded-lg md:mt-4 bg-card hover:bg-secondary transition-colors">
      <Avatar className="size-8 lg:size-10">
        <AvatarImage src={account.avatar_url ?? undefined} alt="Your avatar" />
        <AvatarFallback>
          {account.nickname?.[0] ?? account.email[0]}
        </AvatarFallback>
      </Avatar>
      <div className="grow">
        <p className="font-medium text-sm lg:text-base">{nickname}</p>
        <p className="max-w-32 lg:max-w-40 text-xs lg:text-sm text-muted-foreground overflow-hidden whitespace-nowrap text-ellipsis">
          {account.email}
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
            <Link href="/support">
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
