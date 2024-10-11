import type { Account } from "@/types";
import { serverRequester } from "@/utils/requester/server";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { DeleteAccountCard } from "./cards/delete-account-card";
import { UpdateEmailCard } from "./cards/update-email-card";

export default async function AccountSettingsPage() {
  const { data: me, error } = await serverRequester.get<Account>("/auth/me");

  if (error && error.status === 401) {
    redirect("/login");
  }

  if (error) {
    console.error(error);
    return null;
  }

  return (
    <div className="grid gap-6">
      <UpdateEmailCard initialEmail={me.email} />
      <DeleteAccountCard />
    </div>
  );
}

export const metadata: Metadata = {
  title: "Account Settings",
};
