import { mockAccounts, mockWishlists } from "@/app/api/mock-db";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

type RouteSegments = {
  params: Promise<{
    userId: string;
    itemId: string;
  }>;
};

// Get the wanted situation of a user towards an item.
export async function GET(_: NextRequest, { params }: RouteSegments) {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    return NextResponse.json({ error: "Please log in first" }, { status: 401 });
  }

  const account = mockAccounts.find(
    (account) => account.id === Number(accessToken),
  );

  if (!account) {
    return NextResponse.json({ error: "Account not found" }, { status: 404 });
  }

  const { userId, itemId } = await params;

  if (account.id !== Number(userId)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const target = mockWishlists.find(
    (entry) => entry.item.id === itemId && entry.wanter.id === Number(userId),
  );

  if (!target) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  return NextResponse.json({ ...target.item, wanted_at: target.wanted_at });
}

// Want item.
export async function POST(req: NextRequest, { params }: RouteSegments) {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    return NextResponse.json({ error: "Please log in first" }, { status: 401 });
  }

  const account = mockAccounts.find(
    (account) => account.id === Number(accessToken),
  );

  if (!account) {
    return NextResponse.json({ error: "Account not found" }, { status: 404 });
  }

  const { userId } = await params;

  if (account.id !== Number(userId)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const json = await req.json();

  const newWishlistEntry = {
    item: json,
    wanter: {
      id: account.id,
      nickname: account.nickname,
      avatar_url: account.avatar_url,
    },
    wanted_at: new Date().toISOString(),
  };

  mockWishlists.push(newWishlistEntry);

  return new NextResponse(null, { status: 204 });
}

// Unwant item.
export async function DELETE(_: NextRequest, { params }: RouteSegments) {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    return NextResponse.json({ error: "Please log in first" }, { status: 401 });
  }

  const account = mockAccounts.find(
    (account) => account.id === Number(accessToken),
  );

  if (!account) {
    return NextResponse.json({ error: "Account not found" }, { status: 404 });
  }

  const { userId, itemId } = await params;

  if (account.id !== Number(userId)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const target = mockWishlists.find(
    (entry) => entry.item.id === itemId && entry.wanter.id === Number(userId),
  );

  if (!target) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  mockWishlists.splice(mockWishlists.indexOf(target), 1);

  return new NextResponse(null, { status: 204 });
}
