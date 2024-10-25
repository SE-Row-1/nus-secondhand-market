"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { clientRequester } from "@/query/requester/client";
import { useMutation } from "@tanstack/react-query";
import { FlagIcon, Loader2Icon } from "lucide-react";
import type { Dispatch } from "react";
import * as v from "valibot";
import type { PasswordResetAction, PasswordResetState } from "./reducer";

const formSchema = v.object({
  password: v.pipe(
    v.string("Password should be a string"),
    v.minLength(8, "Password should be at least 8 characters long"),
    v.maxLength(20, "Password should be at most 20 characters long"),
  ),
  passwordConfirmation: v.pipe(
    v.string("Password should be a string"),
    v.minLength(8, "Password should be at least 8 characters long"),
    v.maxLength(20, "Password should be at most 20 characters long"),
  ),
});

type Props = {
  state: PasswordResetState;
  dispatch: Dispatch<PasswordResetAction>;
};

export function NewPasswordForm({ state, dispatch }: Props) {
  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationFn: async (formData: FormData) => {
      const { password, passwordConfirmation } = await v.parseAsync(
        formSchema,
        Object.fromEntries(formData),
      );

      if (password !== passwordConfirmation) {
        throw new Error("Passwords do not match. Please double check.");
      }

      return await clientRequester.post<undefined>("/auth/reset-password", {
        id: state.transactionId,
        new_password: password,
      });
    },
    onSuccess: () => {
      dispatch({ type: "COMPLETE" });
    },
    onError: (error) => {
      toast({ variant: "destructive", description: error.message });
    },
  });

  return (
    <form action={mutate} className="grid gap-4 min-w-80">
      <div className="grid gap-2">
        <Label showRequiredMarker htmlFor="password">
          New password
        </Label>
        <Input
          type="password"
          name="password"
          required
          placeholder="8-20 characters"
          id="password"
        />
      </div>
      <div className="grid gap-2">
        <Label showRequiredMarker htmlFor="passwordConfirmation">
          Confirm new password
        </Label>
        <Input
          type="password"
          name="passwordConfirmation"
          required
          placeholder="Type your password again"
          id="passwordConfirmation"
        />
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? (
          <Loader2Icon className="size-4 mr-2 animate-spin" />
        ) : (
          <FlagIcon className="size-4 mr-2" />
        )}
        Finish
      </Button>
    </form>
  );
}
