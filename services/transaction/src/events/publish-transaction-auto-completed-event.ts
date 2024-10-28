import type { Transaction } from "@/types";
import { channel, transactionExchange } from "./init";

export function publishTransactionAutoCompletedEvent(transaction: Transaction) {
  channel.publish(
    transactionExchange,
    "transaction.auto-completed",
    Buffer.from(JSON.stringify(transaction)),
    {
      persistent: true,
    },
  );
}
