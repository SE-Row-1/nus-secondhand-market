import { ItemStatus } from "@/types";
import { NextRequest, NextResponse } from "next/server";
import { mockItems } from "./mock";

export async function GET(request: NextRequest) {
  const cursorStr = request.nextUrl.searchParams.get("cursor");
  const cursor = cursorStr ? +cursorStr : 0;

  const items = mockItems.slice(cursor, cursor + 10);

  return NextResponse.json(
    {
      items,
      next_cursor: items.length < 10 ? null : String(cursor + 10),
    },
    { status: 200 },
  );
}

export async function POST() {
  return NextResponse.json(
    {
      id: crypto.randomUUID(),
      type: "single",
      seller: {
        id: 1,
        nickname: "Johnny",
        avatar_url: "https://avatars.githubusercontent.com/u/78269445?v=4",
      },
      status: ItemStatus.FOR_SALE,
      created_at: new Date().toISOString(),
      deleted_at: null,
    },
    { status: 201 },
  );
}
