import { prefetchMe } from "@/prefetchers";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { UpdateWhatsappCard } from "../cards/update-whatsapp-card";

export default async function ContactsSettingsPage() {
  const { data: me, error } = await prefetchMe();

  if (error && error.status === 401) {
    redirect("/login");
  }

  if (error) {
    redirect(`/error?message=${error.message}`);
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
