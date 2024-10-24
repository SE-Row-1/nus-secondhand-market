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
import { useToast } from "@/components/ui/use-toast";
import { useMe } from "@/query/browser";
import { clientRequester } from "@/query/requester/client";
import type { DetailedAccount } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2Icon, SaveIcon } from "lucide-react";
import * as v from "valibot";

const formSchema = v.object({
  phoneCode: v.pipe(
    v.string("Country code should be a text string."),
    v.digits("Country code should only contain digits."),
    v.minLength(1, "Country code should be at least 1 character long."),
    v.maxLength(3, "Country code should be at most 3 character long."),
  ),
  phoneNumber: v.pipe(
    v.string("Phone number should be a text string."),
    v.digits("Phone number should only contain digits."),
    v.maxLength(15, "Phone number should be at most 15 characters long."),
  ),
});

export function UpdateWhatsappCard() {
  const { data: me } = useMe();

  const { toast } = useToast();

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (formData: FormData) => {
      if (!me) {
        return undefined;
      }

      const { phoneCode, phoneNumber } = await v.parseAsync(
        formSchema,
        Object.fromEntries(formData),
      );

      return await clientRequester.patch<DetailedAccount>(
        `/accounts/${me.id}`,
        { phone_code: phoneCode, phone_number: phoneNumber },
      );
    },
    onSuccess: (account) => {
      queryClient.setQueryData(["auth", "me"], account);

      toast({ description: "Update success" });
    },
    onError: (error) => {
      toast({ variant: "destructive", description: error.message });
    },
  });

  if (!me) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>WhatsApp</CardTitle>
        <CardDescription>Your WhatsApp phone number.</CardDescription>
      </CardHeader>
      <form action={mutate}>
        <CardContent className="flex items-center gap-2">
          <span>+</span>
          <Input
            type="text"
            name="phoneCode"
            required
            defaultValue={me.phone_code ?? "65"}
            placeholder="65"
            id="phoneCode"
            className="w-14"
          />
          <Input
            type="tel"
            name="phoneNumber"
            required
            defaultValue={me.phone_number ?? ""}
            placeholder="1234 5678"
            id="phoneNumber"
            className="grow"
          />
        </CardContent>
        <CardFooter>
          <Button disabled={isPending} type="submit">
            {isPending ? (
              <Loader2Icon className="size-4 mr-2 animate-spin" />
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
