import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { mockAccounts } from "../../mock-db";

type RouteSegments = {
  params: {
    id: string;
  };
};

// Get account.
export async function GET(_: NextRequest, { params }: RouteSegments) {
  const account = mockAccounts.find(
    (account) => account.id === Number(params.id),
  );

  if (!account) {
    return NextResponse.json({ error: "Account not found" }, { status: 404 });
  }

  return NextResponse.json(account, { status: 200 });
}

// Update account.
export async function PATCH(req: NextRequest, { params }: RouteSegments) {
  const accessToken = cookies().get("access_token")?.value;

  if (!accessToken) {
    return NextResponse.json({ error: "Please log in first" }, { status: 401 });
  }

  if (Number(accessToken) !== Number(params.id)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const account = mockAccounts.find(
    (account) => account.id === Number(accessToken),
  );

  if (!account) {
    return NextResponse.json({ error: "Account not found" }, { status: 404 });
  }

  const json = await req.json();

  const newAccount = { ...account, ...json };

  mockAccounts.splice(mockAccounts.indexOf(account), 1, newAccount);

  return NextResponse.json(newAccount, { status: 200 });
}

// Delete account.
export async function DELETE(_: NextRequest, { params }: RouteSegments) {
  const accessToken = cookies().get("access_token")?.value;

  if (!accessToken) {
    return NextResponse.json({ error: "Please log in first" }, { status: 401 });
  }

  if (Number(accessToken) !== Number(params.id)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const account = mockAccounts.find(
    (account) => account.id === Number(accessToken),
  );

  if (!account) {
    return NextResponse.json({ error: "Account not found" }, { status: 404 });
  }

  const newAccount = { ...account, deleted_at: new Date().toISOString() };

  mockAccounts.splice(mockAccounts.indexOf(account), 1, newAccount);

  cookies().delete("access_token");

  return new NextResponse(null, { status: 204 });
}
