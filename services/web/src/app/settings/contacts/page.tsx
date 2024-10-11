import type { Account } from "@/types";
import { serverRequester } from "@/utils/requester/server";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { UpdateWhatsappCard } from "../cards/update-whatsapp-card";

export default async function ContactsSettingsPage() {
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
      <UpdateWhatsappCard
        initialPhoneCode={me.phone_code}
        initialPhoneNumber={me.phone_number}
      />
    </div>
  );
}

export const metadata: Metadata = {
  title: "Contacts Settings",
};
