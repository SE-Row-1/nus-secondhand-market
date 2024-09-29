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

export function UpdateEmailCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Email</CardTitle>
        <CardDescription>
          Preferrably your EDU email address, used for identity verification and
          login.
        </CardDescription>
      </CardHeader>
      <form>
        <CardContent>
          <Input
            type="email"
            name="email"
            required
            placeholder="e1234567@u.nus.edu"
            id="email"
          />
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button type="submit">
            <SaveIcon className="size-4 mr-2" />
            Save
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
