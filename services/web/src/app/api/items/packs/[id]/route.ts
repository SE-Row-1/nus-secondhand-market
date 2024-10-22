import { mockAccounts, mockItems } from "@/app/api/mock-db";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

type RouteSegments = {
  params: {
    id: string;
  };
};

// Decompose item pack.
export function DELETE(_: NextRequest, { params }: RouteSegments) {
  const accessToken = cookies().get("access_token")?.value;

  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const account = mockAccounts.find(
    (account) => account.id === Number(accessToken),
  );

  if (!account) {
    return NextResponse.json({ error: "Account not found" }, { status: 404 });
  }

  const pack = mockItems.find((item) => item.id === params.id);

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
