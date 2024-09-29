import { UpdateAvatarCard } from "../cards/update-avatar-card";
import { UpdateNicknameCard } from "../cards/update-nickname-card";

export default function DisplaySettingsPage() {
  return (
    <div className="grid gap-6">
      <UpdateAvatarCard />
      <UpdateNicknameCard />
    </div>
  );
}
