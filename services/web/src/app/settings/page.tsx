import { createPrefetcher } from "@/query/server";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { DeleteAccountCard } from "./delete-account-card";
import { UpdateEmailCard } from "./update-email-card";
import { UpdateNicknameCard } from "./update-nickname-card";
import { UpdatePasswordCard } from "./update-password-card";
import { UpdateWhatsappCard } from "./update-whatsapp-card";

export default async function AccountSettingsPage() {
  const prefetcher = createPrefetcher();

  const me = await prefetcher.prefetchMe();

  if (!me) {
    redirect("/login");
  }

  return (
    <div className="grid gap-6 w-full max-w-xl mx-auto">
      <UpdateEmailCard id={me.id} initialEmail={me.email} />
      <UpdatePasswordCard />
      <UpdateNicknameCard id={me.id} initialNickname={me.nickname} />
      <UpdateWhatsappCard
        id={me.id}
        initialPhoneCode={me.phone_code}
        initialPhoneNumber={me.phone_number}
      />
      <DeleteAccountCard id={me.id} />
    </div>
  );
}

export const metadata: Metadata = {
  title: "Settings",
};
