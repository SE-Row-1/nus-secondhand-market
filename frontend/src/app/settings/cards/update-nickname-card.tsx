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

export function UpdateNicknameCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Nickname</CardTitle>
        <CardDescription>
          Your preferred name, displayed to everyone else on the platform.
        </CardDescription>
      </CardHeader>
      <form>
        <CardContent>
          <Input
            type="text"
            name="nickname"
            required
            placeholder="2-20 characters"
            id="nickname"
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
