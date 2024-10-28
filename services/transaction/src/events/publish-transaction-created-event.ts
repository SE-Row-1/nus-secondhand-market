import type { Transaction } from "@/types";
import { channel, transactionExchange } from "./init";

export function publishTransactionCreatedEvent(transaction: Transaction) {
  channel.publish(
    transactionExchange,
    "transaction.created",
    Buffer.from(JSON.stringify(transaction)),
    {
      persistent: true,
    },
  );
}
