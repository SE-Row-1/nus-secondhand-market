import type { Transaction } from "@/types";
import { channel, transactionExchange } from "./init";

export function publishTransactionCancelledEvent(transaction: Transaction) {
  channel.publish(
    transactionExchange,
    "transaction.cancelled",
    Buffer.from(JSON.stringify(transaction)),
    {
      persistent: true,
    },
  );
}
