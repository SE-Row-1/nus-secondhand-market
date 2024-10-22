import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { mockAccounts, mockWishlists } from "../../mock-db";

type RouteSegments = {
  params: {
    userId: string;
  };
};

// Get user's wishlist.
export async function GET(req: NextRequest, { params }: RouteSegments) {
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

  if (account.id !== Number(params.userId)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { limit = "10", cursor = "0" } = Object.fromEntries(
    req.nextUrl.searchParams,
  );

  const wishlistItems = mockWishlists
    .filter((wishlist) => wishlist.wanter.id === Number(params.userId))
    .toSorted(
      (a, b) =>
        new Date(b.item.created_at).getTime() -
        new Date(a.item.created_at).getTime(),
    )
    .map((entry) => entry.item);

  const rangedItems = wishlistItems.slice(
    Number(cursor),
    Number(cursor) + Number(limit),
  );

  const isLastPage = Number(cursor) + Number(limit) >= wishlistItems.length;

  return NextResponse.json(
    {
      items: rangedItems,
      next_cursor: isLastPage ? null : String(Number(cursor) + Number(limit)),
    },
    { status: 200 },
  );
}
