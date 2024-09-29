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
import { SendIcon } from "lucide-react";

export function UpdateWhatsappCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>WhatsApp</CardTitle>
        <CardDescription>Your WhatsApp phone number.</CardDescription>
      </CardHeader>
      <form>
        <CardContent className="flex items-center gap-2">
          <span>+</span>
          <Input
            type="text"
            name="code"
            required
            defaultValue="65"
            placeholder="65"
            id="code"
            className="w-14"
          />
          <Input
            type="tel"
            name="phone"
            required
            placeholder="1234 5678"
            id="phone"
            className="grow"
          />
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button type="submit">
            <SendIcon className="size-4 mr-2" />
            Send verification code
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
