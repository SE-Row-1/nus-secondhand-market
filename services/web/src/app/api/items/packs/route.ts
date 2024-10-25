import { ItemType, type Item } from "@/types";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { mockAccounts, mockItems } from "../../mock-db";

// Compose item pack.
export async function POST(req: NextRequest) {
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

  const { name, description, discount = 0, children_ids } = await req.json();

  const children = mockItems.filter((item) => children_ids.includes(item.id));

  if (children.length !== children_ids.length) {
    return NextResponse.json(
      { error: "Some children not found" },
      { status: 404 },
    );
  }

  if (children.some((item) => item.seller.id !== account.id)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const pack: Item = {
    id: crypto.randomUUID(),
    type: ItemType.Pack,
    seller: {
      id: account.id,
      nickname: account.nickname,
      avatar_url: account.avatar_url,
    },
    name,
    description,
    price: children.reduce((acc, item) => acc + item.price, 0) * (1 - discount),
    discount,
    children,
    status: children[0]!.status,
    created_at: new Date().toISOString(),
    deleted_at: null,
  };

  mockItems.push(pack);

  children.forEach((item) => {
    mockItems.splice(mockItems.indexOf(item), 1);
  });

  return NextResponse.json(pack, { status: 201 });
}
