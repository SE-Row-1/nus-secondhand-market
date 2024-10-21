import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LogInIcon, UserRoundPlusIcon } from "lucide-react";
import Link from "next/link";

export function JoinNowCard() {
  return (
    <Card>
      <CardHeader className="space-y-1 p-4">
        <CardTitle className="text-lg">🤝 Join us now!</CardTitle>
        <CardDescription>
          Find your counterparty, and communicate efficiently.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 p-4 pt-0">
        <Button variant="secondary" size="sm" className="w-full" asChild>
          <Link href="/login">
            <LogInIcon className="size-4 mr-2" />
            Log in
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
