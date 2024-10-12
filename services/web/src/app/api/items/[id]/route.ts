import { NextResponse } from "next/server";
import { mockItems } from "../mock";

export async function GET() {
  return NextResponse.json(mockItems[1]);
}

export async function DELETE() {
  return new Response(null, { status: 204 });
}
