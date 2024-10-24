import { mockAccounts, mockItems } from "@/app/api/mock-db";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

type RouteSegments = {
  params: Promise<{
    id: string;
  }>;
};

// Decompose item pack.
export async function DELETE(_: NextRequest, { params }: RouteSegments) {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const account = mockAccounts.find(
    (account) => account.id === Number(accessToken),
  );

  if (!account) {
    return NextResponse.json({ error: "Account not found" }, { status: 404 });
  }

  const { id } = await params;

  const pack = mockItems.find((item) => item.id === id);

  if (!pack) {
    return NextResponse.json({ error: "Pack not found" }, { status: 404 });
  }

  if (pack.seller.id !== account.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const newPack = { ...pack, deleted_at: new Date().toISOString() };

  mockItems.splice(mockItems.indexOf(pack), 1, newPack);

  return new NextResponse(null, { status: 204 });
}
