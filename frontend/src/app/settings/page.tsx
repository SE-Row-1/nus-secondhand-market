import type { Account } from "@/types";
import { ServerRequester } from "@/utils/requester/server";
import { DeleteAccountCard } from "./cards/delete-account-card";
import { UpdateEmailCard } from "./cards/update-email-card";

export default async function SettingsPage() {
  const me = await new ServerRequester().get<Account | undefined>("auth/me");

  return (
    <div className="grid gap-6">
      <UpdateEmailCard initialEmail={me?.email ?? ""} />
      <DeleteAccountCard />
    </div>
  );
}
