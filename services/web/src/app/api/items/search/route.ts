import { NextResponse, type NextRequest } from "next/server";
import { mockItems } from "../../mock-db";

// Search items.
export async function GET(req: NextRequest) {
  const { q } = Object.fromEntries(req.nextUrl.searchParams);

  return NextResponse.json({
    items: mockItems.filter((item) =>
      (item.name + item.description)
        .toLowerCase()
        .includes(q?.toLowerCase() ?? ""),
    ),
    next_threshold: 0,
    next_cursor: null,
  });
}
