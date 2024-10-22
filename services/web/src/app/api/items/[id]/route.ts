import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { mockAccounts, mockItems } from "../../mock-db";

type RouteSegments = {
  params: {
    id: string;
  };
};

// Get item.
export async function GET(_: NextRequest, { params }: RouteSegments) {
  const item = mockItems.find((item) => item.id === params.id);

  if (!item) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  const seller = mockAccounts.find((account) => account.id === item.seller.id);

  if (!seller) {
    return NextResponse.json({ error: "Seller not found" }, { status: 404 });
  }

  return NextResponse.json({ ...item, seller }, { status: 200 });
}

// Update item.
export async function PATCH(req: NextRequest, { params }: RouteSegments) {
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

  const item = mockItems.find((item) => item.id === params.id);

  if (!item) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  if (item.seller.id !== account.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const formData = Object.fromEntries(await req.formData());

  const newItem = { ...item, ...formData };

  mockItems.splice(mockItems.indexOf(item), 1, newItem);

  return NextResponse.json(newItem, { status: 200 });
}

export async function DELETE(_: NextRequest, { params }: RouteSegments) {
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

  const item = mockItems.find((item) => item.id === params.id);

  if (!item) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  if (item.seller.id !== account.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const newItem = { ...item, deleted_at: new Date().toISOString() };

  mockItems.splice(mockItems.indexOf(item), 1, newItem);

  return new NextResponse(null, { status: 204 });
}
