import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { mockAccounts } from "../../mock-db";

// Get current user.
export async function GET() {
  const accessToken = cookies().get("access_token")?.value;

  if (!accessToken) {
    return NextResponse.json({ error: "Please log in first" }, { status: 401 });
  }

  const account = mockAccounts.find(
    (account) => account.id === Number(accessToken),
  );

  if (!account) {
    return NextResponse.json({ error: "Account not found" }, { status: 404 });
  }

  return NextResponse.json(account, { status: 200 });
}
