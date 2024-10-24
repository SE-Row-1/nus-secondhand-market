import { DataTable } from "@/components/ui/data-table";
import { createPrefetcher } from "@/query/server";
import type { Metadata } from "next";
import { columns } from "./columns";

export default async function TransactionsPage() {
  const prefetcher = createPrefetcher();

  const transactions = await prefetcher.prefetchTransactions();

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={transactions ?? []} />
    </div>
  );
}

export const metadata: Metadata = {
  title: "Transactions",
};
