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

type Props = {
  user: Record<string, unknown> | null;
};

export function UserCard({ user }: Props) {
  if (!user) {
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
    <div className="relative self-stretch flex items-center gap-3 px-4 py-3 border rounded-lg md:mt-4 bg-card">
      <Avatar className="size-8 lg:size-10">
        <AvatarImage
          src="https://avatars.githubusercontent.com/u/78269445?v=4"
          alt="Your avatar"
        />
        <AvatarFallback>M</AvatarFallback>
      </Avatar>
      <div className="grow">
        <p className="font-medium text-sm lg:text-base">mrcaidev</p>
        <p className="max-w-32 lg:max-w-40 text-xs lg:text-sm text-muted-foreground overflow-hidden whitespace-nowrap text-ellipsis">
          mrcaidev@gmail.com
        </p>
      </div>
      <Link href="#">
        <span className="sr-only">Visit profile</span>
      </Link>
    </div>
  );
}
