import * as transactionsRepository from "@/transaction/repository";
import type { DetailedAccount } from "@/types";
import { accountExchange, channel } from "./init";

export async function consumeAccountUpdatedEvent() {
  const { queue } = await channel.assertQueue("transaction.account.updated");

  await channel.bindQueue(queue, accountExchange, "account.updated.*");

  channel.consume(queue, async (message) => {
    if (!message) {
      return;
    }

    const account: DetailedAccount = JSON.parse(message.content.toString());

    await transactionsRepository.updateAccount(account);

    channel.ack(message);
  });
}
