import { ItemCardList } from "@/components/item";
import { ItemType, type Account } from "@/types";
import { serverRequester } from "@/utils/requester/server";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export default async function BelongingsPage() {
  const { data: me, error } = await serverRequester.get<Account>("/auth/me");

  if (error && error.status === 401) {
    redirect("/login");
  }

  if (error) {
    console.error(error);
    return null;
  }

  return (
    <div>
      <div className="space-y-4 mt-4 md:mt-8 mb-8">
        <h1 className="font-bold text-3xl">My Belongings</h1>
        <p className="text-muted-foreground">
          Here are the items you have listed for sale.
        </p>
      </div>
      <ItemCardList type={ItemType.SINGLE} sellerId={me.id} />
    </div>
  );
}

export const metadata: Metadata = {
  title: "My Belongings",
};
