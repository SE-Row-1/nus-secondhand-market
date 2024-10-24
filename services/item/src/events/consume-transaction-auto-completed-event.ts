import { ItemStatus } from "@/types";
import { itemsCollection, transactionsCollection } from "@/utils/db";
import { channel, delayedExchange } from "./init";

export async function consumeTransactionAutoCompletedEvent() {
  const { queue } = await channel.assertQueue(
    "transaction.transaction.auto-completed",
  );

  await channel.bindQueue(queue, delayedExchange, "transaction.auto-completed");

  channel.consume(queue, async (message) => {
    if (!message) {
      return;
    }

    const autoCompletedTransactionId = JSON.parse(
      message.content.toString(),
    ) as string;

    const transaction = await transactionsCollection.findOne({
      id: autoCompletedTransactionId,
    });

    if (!transaction) {
      channel.ack(message);
      return;
    }

    if (transaction.completedAt || transaction.cancelledAt) {
      channel.ack(message);
      return;
    }

    await itemsCollection.updateOne(
      {
        id: transaction.item.id,
      },
      {
        $set: {
          status: ItemStatus.Sold,
        },
      },
    );

    await transactionsCollection.updateOne(
      {
        id: autoCompletedTransactionId,
      },
      {
        $set: {
          completedAt: new Date(),
        },
      },
    );

    channel.ack(message);
  });
}

await consumeTransactionAutoCompletedEvent();
