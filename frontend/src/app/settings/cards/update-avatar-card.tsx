"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UploadIcon } from "lucide-react";

export function UpdateAvatarCard() {
  return (
    <Card>
      <div className="flex justify-between items-center gap-4">
        <CardHeader>
          <CardTitle>Avatar</CardTitle>
          <CardDescription>
            Your profile photo. Help others recognize you quickly!
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Avatar className="size-16">
            <AvatarImage src="https://avatars.githubusercontent.com/u/78269445?v=4" />
            <AvatarFallback>M</AvatarFallback>
          </Avatar>
        </CardContent>
      </div>
      <CardFooter className="border-t px-6 py-4">
        <Button className="cursor-pointer" asChild>
          <label htmlFor="avatar" tabIndex={0}>
            <UploadIcon className="size-4 mr-2" />
            Upload
          </label>
        </Button>
        <input type="file" accept="image/*" className="hidden" id="avatar" />
      </CardFooter>
    </Card>
  );
}
