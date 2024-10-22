import { ItemStatus, ItemType, type Item } from "@/types";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { mockAccounts, mockItems } from "../mock-db";

// Get items.
export async function GET(req: NextRequest) {
  const {
    status,
    seller_id,
    limit = "10",
    cursor = "0",
  } = Object.fromEntries(req.nextUrl.searchParams);

  const filteredItems = mockItems
    .filter((item) => {
      if (status && item.status !== Number(status)) {
        return false;
      }

      if (seller_id && item.seller.id !== Number(seller_id)) {
        return false;
      }

      return true;
    })
    .toSorted(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );

  const rangedItems = filteredItems.slice(
    Number(cursor),
    Number(cursor) + Number(limit),
  );

  const isLastPage = Number(cursor) + Number(limit) >= filteredItems.length;

  return NextResponse.json(
    {
      items: rangedItems,
      next_cursor: isLastPage ? null : String(Number(cursor) + Number(limit)),
    },
    { status: 200 },
  );
}

// Create item.
export async function POST(req: NextRequest) {
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

  const { name, description, price } = Object.fromEntries(await req.formData());

  const newItem: Item = {
    id: crypto.randomUUID(),
    type: ItemType.SINGLE,
    seller: {
      id: account.id,
      nickname: account.nickname,
      avatar_url: account.avatar_url,
    },
    name: String(name),
    description: String(description),
    price: Number(price),
    photo_urls: [],
    status: ItemStatus.FOR_SALE,
    created_at: new Date().toISOString(),
    deleted_at: null,
  };

  mockItems.push(newItem);

  return NextResponse.json(newItem, { status: 201 });
}
