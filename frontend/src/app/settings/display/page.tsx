import type { Account } from "@/types";
import { ServerRequester } from "@/utils/requester/server";
import { UpdateAvatarCard } from "../cards/update-avatar-card";
import { UpdateNicknameCard } from "../cards/update-nickname-card";

export default async function DisplaySettingsPage() {
  const me = await new ServerRequester().get<Account>("auth/me");

  return (
    <div className="grid gap-6">
      <UpdateAvatarCard />
      <UpdateNicknameCard initialNickname={me.nickname} />
    </div>
  );
}
