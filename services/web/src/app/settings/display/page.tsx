import type { DetailedAccount } from "@/types";
import { serverRequester } from "@/utils/requester/server";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { UpdateNicknameCard } from "../cards/update-nickname-card";

export default async function DisplaySettingsPage() {
  const { data: me, error } =
    await serverRequester.get<DetailedAccount>("/auth/me");

  if (error && error.status === 401) {
    redirect("/login?next=/settings/display");
  }

  if (error) {
    redirect(`/error?message=${error.message}`);
  }

  return (
    <div className="grid gap-6">
      <UpdateNicknameCard initialNickname={me.nickname} />
    </div>
  );
}

export const metadata: Metadata = {
  title: "Display Settings",
};
