import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { mockAccounts, mockTransactions } from "../mock-db";

// Get transactions.
export async function GET(req: NextRequest) {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    return NextResponse.json({ error: "Please log in first" }, { status: 401 });
  }

  const account = mockAccounts.find(
    (account) => account.id === Number(accessToken),
  );

  if (!account) {
    return NextResponse.json({ error: "Account not found" }, { status: 404 });
  }

  const { item_id, exclude_cancelled } = Object.fromEntries(
    req.nextUrl.searchParams,
  );

  const transactions = mockTransactions
    .filter((transaction) => {
      if (
        transaction.buyer.id !== account.id &&
        transaction.seller.id !== account.id
      ) {
        return false;
      }

      if (item_id && transaction.item.id !== item_id) {
        return false;
      }

      if (exclude_cancelled === "true" && transaction.cancelled_at !== null) {
        return false;
      }

      return true;
    })
    .toSorted(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );

  return NextResponse.json(transactions, { status: 200 });
}
