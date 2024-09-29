import { DeleteAccountCard } from "./cards/delete-account-card";
import { UpdateEmailCard } from "./cards/update-email-card";
import { UpdatePasswordCard } from "./cards/update-password-card";

export default function SettingsPage() {
  return (
    <div className="grid gap-6">
      <UpdateEmailCard />
      <UpdatePasswordCard />
      <DeleteAccountCard />
    </div>
  );
}
