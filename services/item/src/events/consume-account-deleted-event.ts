import { itemsCollection, transactionsCollection } from "@/utils/db";
import { accountExchange, channel } from "./init";

export async function consumeAccountDeletedEvent() {
  const { queue } = await channel.assertQueue("item.account.deleted");

  await channel.bindQueue(queue, accountExchange, "account.deleted.*");

  channel.consume(queue, async (message) => {
    if (!message) {
      return;
    }

    const deletedAccountId = Number(JSON.parse(message.content.toString()));
    const deletedAt = new Date();

    await itemsCollection.updateMany(
      {
        "seller.id": deletedAccountId,
      },
      {
        $set: {
          deletedAt,
        },
      },
    );

    await transactionsCollection.updateMany(
      {
        $or: [
          {
            "seller.id": deletedAccountId,
          },
          {
            "buyer.id": deletedAccountId,
          },
        ],
        completedAt: null,
        cancelledAt: null,
      },
      {
        $set: {
          cancelledAt: deletedAt,
        },
      },
    );

    channel.ack(message);
  });
}
