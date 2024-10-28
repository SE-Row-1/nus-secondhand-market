import * as transactionsRepository from "@/transaction/repository";
import type { Account, DetailedItem, Transaction } from "@/types";
import { channel } from "./init";

await consumeEvent("account", "account.updated.*", async (data) => {
  const account = data as Account;
  const count = await transactionsRepository.updateParticipant(account);
  console.log(
    `Updated [Participant ${account.id}]'s information in ${count} transactions`,
  );
});

await consumeEvent("account", "account.deleted.*", async (data) => {
  const accountId = Number(data);
  const count = await transactionsRepository.cancelByParticipantId(accountId);
  console.log(
    `Cancelled [Participant ${accountId}]'s ${count} pending transactions`,
  );
});

await consumeEvent("item", "item.updated", async (data) => {
  const detailedItem = data as DetailedItem;
  const count = await transactionsRepository.updateItem(detailedItem);
  console.log(
    `Updated [Item ${detailedItem.id}]'s information in ${count} transactions`,
  );
});

await consumeEvent("item", "item.deleted", async (data) => {
  const itemId = data as string;
  const count = await transactionsRepository.cancelByItemId(itemId);
  console.log(`Cancelled [Item ${itemId}]'s ${count} pending transactions`);
});

await consumeEvent("delayed", "transaction.auto-completed", async (data) => {
  const transaction = data as Transaction;
  const count = await transactionsRepository.completeById(transaction.id);
  if (count! > 0) {
    console.log(
      `Auto completed [Transaction ${transaction.id}] after 14 days of inactivity`,
    );
  }
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

  console.log(`Started to consume [Queue ${queue}]...`);
}
