import type { DetailedAccount } from "@/types";
import { itemsCollection, transactionsCollection } from "@/utils/db";
import { accountExchange, channel } from "./init";

export async function consumeAccountUpdatedEvent() {
  const { queue } = await channel.assertQueue("item.account.updated");
  console.log(`Asserted queue "${queue}"`);

  await channel.bindQueue(queue, accountExchange, "account.updated.*");
  console.log(
    `Bound queue "${queue}" to exchange "${accountExchange}" on topic "account.updated.*"`,
  );

  channel.consume(queue, async (message) => {
    if (!message) {
      return;
    }

    const updatedAccount = JSON.parse(
      message.content.toString(),
    ) as DetailedAccount;

    await itemsCollection.updateMany(
      {
        "seller.id": updatedAccount.id,
      },
      {
        $set: {
          "seller.nickname": updatedAccount.nickname,
          "seller.avatarUrl": updatedAccount.avatarUrl,
        },
      },
    );

    await transactionsCollection.bulkWrite([
      {
        updateMany: {
          filter: {
            "seller.id": updatedAccount.id,
          },
          update: {
            $set: {
              "seller.nickname": updatedAccount.nickname,
              "seller.avatarUrl": updatedAccount.avatarUrl,
            },
          },
        },
      },
      {
        updateMany: {
          filter: {
            "buyer.id": updatedAccount.id,
          },
          update: {
            $set: {
              "buyer.nickname": updatedAccount.nickname,
              "buyer.avatarUrl": updatedAccount.avatarUrl,
            },
          },
        },
      },
    ]);

    channel.ack(message);
  });
}
