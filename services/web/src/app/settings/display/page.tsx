import type { Account } from "@/types";
import { ServerRequester } from "@/utils/requester/server";
import type { Metadata } from "next";
import { UpdateNicknameCard } from "../cards/update-nickname-card";

export default async function DisplaySettingsPage() {
  const me = await new ServerRequester().get<Account | undefined>("/auth/me");

  return (
    <div className="grid gap-6">
      <UpdateNicknameCard initialNickname={me?.nickname ?? null} />
    </div>
  );
}

export const metadata: Metadata = {
  title: "Display Settings",
};
