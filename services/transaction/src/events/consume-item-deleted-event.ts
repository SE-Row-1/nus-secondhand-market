import * as transactionsRepository from "@/transaction/repository";
import { channel, itemExchange } from "./init";

export async function consumeItemDeletedEvent() {
  const { queue } = await channel.assertQueue("transaction.item.deleted");

  await channel.bindQueue(queue, itemExchange, "item.deleted");

  channel.consume(queue, async (message) => {
    if (!message) {
      return;
    }

    const itemId: string = JSON.parse(message.content.toString());

    await transactionsRepository.cancelByItemId(itemId);

    channel.ack(message);
  });
}
