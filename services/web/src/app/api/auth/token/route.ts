import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { mockAccounts } from "../../mock-db";

// Log in.
export async function POST(req: NextRequest) {
  const { email } = await req.json();

  const account = mockAccounts.find((account) => account.email === email);

  if (!account) {
    return NextResponse.json({ error: "Account not found" }, { status: 404 });
  }

  cookies().set({
    name: "access_token",
    value: String(account.id),
    path: "/",
    domain: "localhost",
    maxAge: 60 * 60 * 24 * 7,
    expires: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
    secure: true,
    sameSite: "lax",
  });

  return NextResponse.json(account, { status: 201 });
}

// Log out.
export async function DELETE() {
  cookies().delete("access_token");

  return new NextResponse(null, { status: 204 });
}
