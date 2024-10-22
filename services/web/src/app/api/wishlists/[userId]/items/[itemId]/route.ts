import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ error: "not found" }, { status: 404 });
}

export async function POST() {
  return new Response(null, { status: 204 });
}

export async function DELETE() {
  return new Response(null, { status: 204 });
}
