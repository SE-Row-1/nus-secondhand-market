import { NextResponse, type NextRequest } from "next/server";
import { mockItems } from "../../mock";

export async function PUT(req: NextRequest) {
  const { status } = await req.json();
  return NextResponse.json({ ...mockItems[0], status });
}
