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
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { clientRequester } from "@/query/requester/client";
import { useMutation } from "@tanstack/react-query";
import { Loader2Icon, SaveIcon } from "lucide-react";
import * as v from "valibot";

const formSchema = v.object({
  oldPassword: v.pipe(
    v.string("Old password should be a string"),
    v.minLength(8, "Old password should be at least 8 characters"),
    v.maxLength(20, "Old password should be at most 20 characters"),
  ),
  newPassword: v.pipe(
    v.string("New password should be a string"),
    v.minLength(8, "New password should be at least 8 characters"),
    v.maxLength(20, "New password should be at most 20 characters"),
  ),
  confirmPassword: v.pipe(
    v.string("Password confirmation should be a string"),
    v.minLength(8, "Password confirmation should be at least 8 characters"),
    v.maxLength(20, "Password confirmation should be at most 20 characters"),
  ),
});

export function UpdatePasswordCard() {
  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationFn: async (formData: FormData) => {
      const { oldPassword, newPassword, confirmPassword } = await v.parseAsync(
        formSchema,
        Object.fromEntries(formData),
      );

      if (newPassword !== confirmPassword) {
        throw new Error("Passwords do not match. Please double check.");
      }

      return await clientRequester.put("/auth/me/password", {
        old_password: oldPassword,
        new_password: newPassword,
      });
    },
    onSuccess: () => {
      toast({ description: "Update success" });
    },
    onError: (error) => {
      toast({ variant: "destructive", description: error.message });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Password</CardTitle>
        <CardDescription>Your login credentials.</CardDescription>
      </CardHeader>
      <form action={mutate}>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="old-password">Old password</Label>
            <Input
              type="password"
              name="oldPassword"
              required
              placeholder="Your current password"
              id="old-password"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="new-password">New password</Label>
            <Input
              type="password"
              name="newPassword"
              required
              placeholder="8-20 characters"
              id="new-password"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirm-password">Confirm new password</Label>
            <Input
              type="password"
              name="confirmPassword"
              required
              placeholder="Type new password again"
              id="confirm-password"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <Loader2Icon className="size-4 mr-2" />
            ) : (
              <SaveIcon className="size-4 mr-2" />
            )}
            Save
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
