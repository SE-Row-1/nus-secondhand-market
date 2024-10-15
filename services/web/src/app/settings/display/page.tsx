import { prefetchMe } from "@/prefetches/me";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { UpdateNicknameCard } from "../cards/update-nickname-card";

export default async function DisplaySettingsPage() {
  const { data: me, error } = await prefetchMe();

  if (error && error.status === 401) {
    redirect("/login");
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
