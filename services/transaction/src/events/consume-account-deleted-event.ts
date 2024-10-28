import * as transactionsRepository from "@/transaction/repository";
import { accountExchange, channel } from "./init";

export async function consumeAccountDeletedEvent() {
  const { queue } = await channel.assertQueue("transaction.account.deleted");

  await channel.bindQueue(queue, accountExchange, "account.deleted.*");

  channel.consume(queue, async (message) => {
    if (!message) {
      return;
    }

    const accountId = Number(JSON.parse(message.content.toString()));

    await transactionsRepository.cancelByAccountId(accountId);

    channel.ack(message);
  });
}
