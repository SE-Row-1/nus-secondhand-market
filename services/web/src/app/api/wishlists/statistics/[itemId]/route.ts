import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    count: 3,
    last_wanted_at: new Date().toISOString(),
  });
}
