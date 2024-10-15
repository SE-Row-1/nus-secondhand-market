import { prefetchMe } from "@/prefetches/me";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { DeleteAccountCard } from "./cards/delete-account-card";
import { UpdateEmailCard } from "./cards/update-email-card";

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
      <UpdateEmailCard initialEmail={me.email} />
      <DeleteAccountCard />
    </div>
  );
}

export const metadata: Metadata = {
  title: "Account Settings",
};
