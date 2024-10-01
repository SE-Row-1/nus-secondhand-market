import { ServerRequester } from "@/utils/requester/server";
import { UpdateWhatsappCard } from "../cards/update-whatsapp-card";
import type { Account } from "@/types";

export default async function ContactsSettingsPage() {
  const me = await new ServerRequester().get<Account>("auth/me");

  return (
    <div className="grid gap-6">
      <UpdateWhatsappCard
        initialPhoneCode={me.phone_code}
        initialPhoneNumber={me.phone_number}
      />
    </div>
  );
}
