import { mockAccounts, mockWishlists } from "@/app/api/mock-db";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

type RouteSegments = {
  params: {
    itemId: string;
  };
};

// Get an item's wishlist statistics.
export async function GET(_: NextRequest, { params }: RouteSegments) {
  const accessToken = cookies().get("access_token")?.value;

  if (!accessToken) {
    return NextResponse.json({ error: "Please log in first" }, { status: 401 });
  }

  const account = mockAccounts.find(
    (account) => account.id === Number(accessToken),
  );

  if (!account) {
    return NextResponse.json({ error: "Account not found" }, { status: 404 });
  }

  const records = mockWishlists
    .filter((entry) => entry.item.id === params.itemId)
    .toSorted(
      (a, b) =>
        new Date(b.item.created_at).getTime() -
        new Date(a.item.created_at).getTime(),
    );

  const count = records.length;
  const last_wanted_at = records[0]?.wanted_at ?? null;
  const wanters = records.map((record) => record.wanter);

  if (account.id === records[0]?.item.seller.id) {
    return NextResponse.json({ count, last_wanted_at, wanters });
  }

  return NextResponse.json({ count, last_wanted_at });
}
