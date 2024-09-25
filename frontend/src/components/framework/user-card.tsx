"use client";

import { useGetRequest } from "@/hooks/use-request";
import type { Account } from "@/types";
import { LogInIcon, UserRoundPlusIcon } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

export function UserCard() {
  const { data: account } = useGetRequest<Account>("/auth/me");

  if (!account) {
    return (
      <Card className="self-stretch md:mt-4">
        <CardHeader>
          <CardTitle>Join us now</CardTitle>
          <CardDescription>
            Find your counterparty, and communicate efficiently.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="secondary" size="sm" className="w-full" asChild>
            <Link href="/login">
              <LogInIcon className="size-4 mr-2" />
              Login
            </Link>
          </Button>
          <Button size="sm" className="w-full" asChild>
            <Link href="/register">
              <UserRoundPlusIcon className="size-4 mr-2" />
              Register
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="relative self-stretch flex items-center gap-3 px-4 py-3 border rounded-lg md:mt-4 bg-card hover:bg-secondary transition-colors">
      <Avatar className="size-8 lg:size-10">
        <AvatarImage src={account.avatar_url ?? undefined} alt="Your avatar" />
        <AvatarFallback>
          {account.nickname?.[0] ?? account.email[0]}
        </AvatarFallback>
      </Avatar>
      <div className="grow">
        <p className="font-medium text-sm lg:text-base">
          {account.nickname ?? account.email.replace("@u.nus.edu", "")}
        </p>
        <p className="max-w-32 lg:max-w-40 text-xs lg:text-sm text-muted-foreground overflow-hidden whitespace-nowrap text-ellipsis">
          {account.email}
        </p>
      </div>
      <Link href={"/user/" + account.id} className="absolute inset-0">
        <span className="sr-only">Visit profile</span>
      </Link>
    </div>
  );
}
