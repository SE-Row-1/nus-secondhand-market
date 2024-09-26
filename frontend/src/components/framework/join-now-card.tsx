import { LogInIcon, UserRoundPlusIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

export function JoinNowCard() {
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
