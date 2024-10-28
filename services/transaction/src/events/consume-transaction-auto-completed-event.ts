import * as transactionsRepository from "@/transaction/repository";
import type { Transaction } from "@/types";
import { channel, itemExchange } from "./init";

export async function consumeTransactionAutoCompletedEvent() {
  const { queue } = await channel.assertQueue(
    "transaction.transaction.auto-completed",
  );

  await channel.bindQueue(queue, itemExchange, "transaction.auto-completed");

  channel.consume(queue, async (message) => {
    if (!message) {
      return;
    }

    const transaction: Transaction = JSON.parse(message.content.toString());

    await transactionsRepository.completeById(transaction.id);

    channel.ack(message);
  });
}
