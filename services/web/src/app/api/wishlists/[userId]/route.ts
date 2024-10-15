import { NextRequest, NextResponse } from "next/server";
import { mockItems } from "../../items/mock";

export async function GET(request: NextRequest) {
  const cursorStr = request.nextUrl.searchParams.get("cursor");
  const cursor = cursorStr ? +cursorStr : 0;

  const items = mockItems.slice(cursor, cursor + 8);

  return NextResponse.json(
    {
      items,
      next_cursor: items.length < 8 ? null : String(cursor + 8),
    },
    { status: 200 },
  );
}

export async function POST() {
  return NextResponse.json({}, { status: 201 });
}
