import { DataTable } from "@/components/ui/data-table";
import { prefetchTransactions } from "@/prefetchers";
import type { Metadata } from "next";
import { columns } from "./columns";

export default async function TransactionsPage() {
  const { data: transactions, error } = await prefetchTransactions();

  if (error) {
    return <div>Error loading transactions</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={transactions} />
    </div>
  );
}

export const metadata: Metadata = {
  title: "Transactions",
};
