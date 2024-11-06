import * as transactionsRepository from "@/transactions/repository";
import type { Account, DetailedItem, Transaction } from "@/types";
import { channel } from "./init";
import { publishEvent } from "./publish";

await consumeEvent("account", "account.updated.*", async (data) => {
  const account = data as Account;
  const count = await transactionsRepository.updateParticipant(account);
  console.log(`Updated [Participant ${account.id}] in ${count} transactions`);
});

await consumeEvent("account", "account.deleted.*", async (data) => {
  const accountId = Number(data);
  const count =
    await transactionsRepository.cancelManyByParticipantId(accountId);
  console.log(
    `Cancelled [Participant ${accountId}]'s ${count} pending transactions`,
  );
});

await consumeEvent("item", "item.updated", async (data) => {
  const detailedItem = data as DetailedItem;
  const count = await transactionsRepository.updateItem(detailedItem);
  console.log(`Updated [Item ${detailedItem.id}] in ${count} transactions`);
});

await consumeEvent("item", "item.deleted", async (data) => {
  const itemId = data as string;
  const count = await transactionsRepository.cancelManyByItemId(itemId);
  console.log(`Cancelled [Item ${itemId}]'s ${count} pending transactions`);
});

await consumeEvent("delayed", "transaction.auto-completed", async (data) => {
  const transaction = data as Transaction;
  const newTransaction = await transactionsRepository.completeOneById(
    transaction.id,
  );

  if (!newTransaction) {
    return;
  }

  console.log(`Auto completed [Transaction ${transaction.id}]`);
  publishEvent("transaction", "transaction.completed", newTransaction);
});

export async function consumeEvent(
  exchange: string,
  topic: string,
  handler: (data: unknown) => Promise<void>,
) {
  const { queue } = await channel.assertQueue(`transaction.${topic}`);

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

  console.log(`Started to consume [Queue ${queue}]`);
}
