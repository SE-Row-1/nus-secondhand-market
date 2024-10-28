import * as transactionsRepository from "@/transaction/repository";
import type { DetailedItem } from "@/types";
import { channel, itemExchange } from "./init";

export async function consumeItemUpdatedEvent() {
  const { queue } = await channel.assertQueue("transaction.item.updated");

  await channel.bindQueue(queue, itemExchange, "item.updated");

  channel.consume(queue, async (message) => {
    if (!message) {
      return;
    }

    const item: DetailedItem = JSON.parse(message.content.toString());

    await transactionsRepository.updateItem(item);

    channel.ack(message);
  });
}
