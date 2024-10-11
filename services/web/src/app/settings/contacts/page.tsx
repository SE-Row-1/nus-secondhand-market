import type { Account } from "@/types";
import { ServerRequester } from "@/utils/requester/server";
import type { Metadata } from "next";
import { UpdateWhatsappCard } from "../cards/update-whatsapp-card";

export default async function ContactsSettingsPage() {
  const me = await new ServerRequester().get<Account | undefined>("/auth/me");

  return (
    <div className="grid gap-6">
      <UpdateWhatsappCard
        initialPhoneCode={me?.phone_code ?? null}
        initialPhoneNumber={me?.phone_number ?? null}
      />
    </div>
  );
}

export const metadata: Metadata = {
  title: "Contacts Settings",
};
