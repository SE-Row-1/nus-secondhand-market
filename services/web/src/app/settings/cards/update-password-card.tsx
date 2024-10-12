"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SaveIcon } from "lucide-react";

export function UpdatePasswordCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Password</CardTitle>
        <CardDescription>Your login credentials.</CardDescription>
      </CardHeader>
      <form>
        <CardContent className="space-y-4">
          <Input
            type="password"
            name="old_password"
            required
            placeholder="Old password"
            id="old-password"
          />
          <Input
            type="password"
            name="new_password"
            required
            placeholder="New password (8-20 characters)"
            id="new-password"
          />
          <Input
            type="password"
            name="confirm_password"
            required
            placeholder="Confirm new password"
            id="confirm-password"
          />
        </CardContent>
        <CardFooter>
          <Button type="submit">
            <SaveIcon className="size-4 mr-2" />
            Save
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
