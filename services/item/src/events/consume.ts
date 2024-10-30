import * as itemsRepository from "@/items/repository";
import { ItemStatus, type Account, type Transaction } from "@/types";
import { channel } from "./init";

await consumeEvent("account", "account.updated.*", async (data) => {
  const account = data as Account;

  const { modifiedCount } = await itemsRepository.updateSeller(account);

  console.log(`Updated [Seller ${account.id}] in ${modifiedCount} items`);
});

await consumeEvent("account", "account.deleted.*", async (data) => {
  const accountId = Number(data);

  const { modifiedCount } =
    await itemsRepository.deleteManyBySellerId(accountId);

  console.log(`Deleted [Seller ${accountId}]'s ${modifiedCount} items`);
});

await consumeEvent("transaction", "transaction.created", async (data) => {
  const transaction = data as Transaction;

  const newItem = await itemsRepository.updateOneById(transaction.item.id, {
    status: ItemStatus.Dealt,
  });

  if (!newItem) {
    return;
  }

  console.log(`Marked [Item ${newItem.id}] as dealt`);
});

await consumeEvent("transaction", "transaction.completed", async (data) => {
  const transaction = data as Transaction;

  const newItem = await itemsRepository.updateOneById(transaction.item.id, {
    status: ItemStatus.Sold,
  });

  if (!newItem) {
    return;
  }

  console.log(`Marked [Item ${newItem.id}] as sold`);
});

await consumeEvent("transaction", "transaction.cancelled", async (data) => {
  const transaction = data as Transaction;

  const newItem = await itemsRepository.updateOneById(transaction.item.id, {
    status: ItemStatus.ForSale,
  });

  if (!newItem) {
    return;
  }

  console.log(`Marked [Item ${newItem.id}] as for sale`);
});

export async function consumeEvent(
  exchange: string,
  topic: string,
  handler: (data: unknown) => Promise<void>,
) {
  const { queue } = await channel.assertQueue(`item.${topic}`);

  console.log(`Asserted [Queue ${queue}]`);

  await channel.bindQueue(queue, exchange, topic);

  console.log(
    `Bound [Queue ${queue}] to [Topic ${topic}]@[Exchange ${exchange}]`,
  );

  channel.consume(queue, async (message) => {
    if (!message) {
      return;
    }

    console.log(`Received from [Topic ${topic}]@[Exchange ${exchange}]`);

    const content = message.content.toString();

    try {
      const data = JSON.parse(content);
      await handler(data);
      channel.ack(message);
    } catch (error) {
      if (error instanceof Error) {
        console.error(
          `Failed to handle [Message ${content}]: ${error.message}`,
        );
      } else {
        console.error(`Failed to handle [Message ${content}]: ${error}`);
      }

      channel.nack(message);
    }
  });

  console.log(`Started to consume [Queue ${queue}]...`);
}
