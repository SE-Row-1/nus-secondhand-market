import { mockAccounts, mockItems, mockTransactions } from "@/app/api/mock-db";
import { ItemStatus } from "@/types";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

type RouteSegments = {
  params: Promise<{
    id: string;
  }>;
};

// Update item status.
export async function PUT(req: NextRequest, { params }: RouteSegments) {
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

  const { id } = await params;

  const item = mockItems.find((item) => item.id === id);

  if (!item) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  const { status, buyer } = await req.json();

  if (item.status === ItemStatus.FOR_SALE && status === ItemStatus.DEALT) {
    if (account.id !== item.seller.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!buyer) {
      return NextResponse.json({ error: "Buyer is required" }, { status: 400 });
    }

    const pendingTransaction = mockTransactions.find(
      (transaction) =>
        transaction.item.id === item.id &&
        transaction.completed_at === null &&
        transaction.cancelled_at === null,
    );

    if (pendingTransaction) {
      return NextResponse.json(
        { error: "There is a pending transaction for this item" },
        { status: 409 },
      );
    }

    mockTransactions.push({
      id: crypto.randomUUID(),
      item: {
        id: item.id,
        name: item.name,
        price: item.price,
      },
      buyer: buyer,
      seller: item.seller,
      created_at: new Date().toISOString(),
      completed_at: null,
      cancelled_at: null,
    });

    const newItem = { ...item, status };

    mockItems.splice(mockItems.indexOf(item), 1, newItem);

    return NextResponse.json(newItem, { status: 200 });
  }

  if (item.status === ItemStatus.DEALT && status === ItemStatus.FOR_SALE) {
    if (account.id !== item.seller.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const pendingTransaction = mockTransactions.find(
      (transaction) =>
        transaction.item.id === item.id &&
        transaction.completed_at === null &&
        transaction.cancelled_at === null,
    );

    if (!pendingTransaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 },
      );
    }

    const newTransaction = {
      ...pendingTransaction,
      cancelled_at: new Date().toISOString(),
    };

    mockTransactions.splice(
      mockTransactions.indexOf(pendingTransaction),
      1,
      newTransaction,
    );

    const newItem = { ...item, status };

    mockItems.splice(mockItems.indexOf(item), 1, newItem);

    return NextResponse.json(newItem, { status: 200 });
  }

  if (item.status === ItemStatus.DEALT && status === ItemStatus.SOLD) {
    const pendingTransaction = mockTransactions.find(
      (transaction) =>
        transaction.item.id === item.id &&
        transaction.completed_at === null &&
        transaction.cancelled_at === null,
    );

    if (!pendingTransaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 },
      );
    }

    const newTransaction = {
      ...pendingTransaction,
      completed_at: new Date().toISOString(),
    };

    mockTransactions.splice(
      mockTransactions.indexOf(pendingTransaction),
      1,
      newTransaction,
    );

    const newItem = { ...item, status };

    mockItems.splice(mockItems.indexOf(item), 1, newItem);

    return NextResponse.json(newItem, { status: 200 });
  }

  return NextResponse.json(
    { error: "Transition not allowed" },
    { status: 400 },
  );
}
