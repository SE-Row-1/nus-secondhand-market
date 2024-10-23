import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { mockAccounts } from "../mock-db";

// Create account.
// Not actually creating, just returning the first account from the mock database.
export async function POST() {
  const cookieStore = await cookies();

  cookieStore.set({
    name: "access_token",
    value: "1",
    path: "/",
    domain: "localhost",
    maxAge: 60 * 60 * 24 * 7,
    expires: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
    secure: true,
    sameSite: "lax",
  });

  return NextResponse.json(mockAccounts[0], { status: 201 });
}
