import { prefetchMe } from "@/prefetchers";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { DeleteAccountCard } from "./cards/delete-account-card";
import { UpdateEmailCard } from "./cards/update-email-card";
import { UpdatePasswordCard } from "./cards/update-password-card";

export default async function AccountSettingsPage() {
  const { data: me, error } = await prefetchMe();

  if (error && error.status === 401) {
    redirect("/login");
  }

  if (error) {
    redirect(`/error?message=${error.message}`);
  }

  return (
    <div className="grid gap-6">
      <UpdateEmailCard id={me.id} initialEmail={me.email} />
      <UpdatePasswordCard />
      <DeleteAccountCard id={me.id} />
    </div>
  );
}

export const metadata: Metadata = {
  title: "Account Settings",
};
