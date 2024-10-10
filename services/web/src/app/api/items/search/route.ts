import { NextResponse, type NextRequest } from "next/server";
import { mockItems } from "../mock";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q");

  await new Promise((resolve) => setTimeout(resolve, 4000));

  return NextResponse.json({
    items: mockItems.filter((item) =>
      (item.name + " " + item.description).toLowerCase().includes(q ?? ""),
    ),
    next_threshold: 0,
    next_cursor: null,
  });
}
