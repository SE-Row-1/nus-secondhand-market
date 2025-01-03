import { mockAccounts, mockWishlists } from "@/app/api/mock-db";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

type RouteSegments = {
  params: Promise<{
    itemId: string;
  }>;
};

// Get an item's wishlist statistics.
export async function GET(_: NextRequest, { params }: RouteSegments) {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("access_token")?.value;

  const account = accessToken
    ? mockAccounts.find((account) => account.id === Number(accessToken))
    : undefined;

  const { itemId } = await params;

  const records = mockWishlists
    .filter((entry) => entry.item.id === itemId)
    .toSorted(
      (a, b) =>
        new Date(b.item.created_at).getTime() -
        new Date(a.item.created_at).getTime(),
    );

  const count = records.length;
  const last_wanted_at = records[0]?.wanted_at ?? null;
  const wanters =
    account?.id === records[0]?.item.seller.id
      ? records.map((record) => record.wanter)
      : [];

  return NextResponse.json({ count, last_wanted_at, wanters });
}
