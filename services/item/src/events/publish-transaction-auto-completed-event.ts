import { channel, delayedExchange } from "./init";

export function publishTransactionAutoCompletedEvent(transactionId: string) {
  channel.publish(
    delayedExchange,
    "transaction.auto-completed",
    Buffer.from(JSON.stringify(transactionId)),
    {
      persistent: true,
      headers: {
        "x-delay": 1000 * 60 * 60 * 24 * 14,
      },
    },
  );
}
