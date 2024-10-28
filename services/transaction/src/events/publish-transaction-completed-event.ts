import type { Transaction } from "@/types";
import { channel, transactionExchange } from "./init";

export function publishTransactionCompletedEvent(transaction: Transaction) {
  channel.publish(
    transactionExchange,
    "transaction.completed",
    Buffer.from(JSON.stringify(transaction)),
    {
      persistent: true,
    },
  );
}
