import { ItemCardList } from "@/components/item";
import { type Account } from "@/types";
import { ServerRequester } from "@/utils/requester/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Belongings",
};

export default async function BelongingsPage() {
  const me = await new ServerRequester().get<Account | undefined>("/auth/me");

  if (!me) {
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-64px)]">
      <div className="space-y-4 mt-4 md:mt-8 mb-8">
        <h1 className="font-bold text-3xl">My Belongings</h1>
        <p className="text-muted-foreground">
          Here are the items you have listed for sale.
        </p>
      </div>
      <ItemCardList sellerId={me.id} />
    </div>
  );
}
