import type { DetailedAccount, Item } from "@/types";
import amqplib from "amqplib";
import { itemsCollection } from "./db";

const connection = await amqplib.connect(Bun.env.RABBITMQ_URL);
const channel = await connection.createChannel();

const { exchange: accountExchange } = await channel.assertExchange(
  "account",
  "topic",
);

const { exchange: itemExchange } = await channel.assertExchange(
  "item",
  "topic",
);

async function consumeAccountUpdatedEvent() {
  const { queue } = await channel.assertQueue("item.account.updated");

  await channel.bindQueue(queue, accountExchange, "account.updated.success");

  console.log("Consuming event: account.updated.success");

  channel.consume(queue, async (message) => {
    if (!message) {
      return;
    }

    const account = JSON.parse(message.content.toString()) as DetailedAccount;

    await itemsCollection.updateMany(
      { "seller.id": account.id },
      {
        $set: {
          seller: {
            id: account.id,
            nickname: account.nickname,
            avatarUrl: account.avatarUrl,
          },
        },
      },
    );

    channel.ack(message);
  });
}

await consumeAccountUpdatedEvent();

async function consumeAccountDeletedEvent() {
  const { queue } = await channel.assertQueue("item.account.deleted");

  await channel.bindQueue(queue, accountExchange, "account.deleted.success");

  console.log("Consuming event: account.deleted.success");

  channel.consume(queue, async (message) => {
    if (!message) {
      return;
    }

    const accountId = Number(JSON.parse(message.content.toString()));

    const deletedAt = new Date();
    await itemsCollection.updateMany(
      { "seller.id": accountId },
      {
        $set: {
          deletedAt,
        },
      },
    );

    channel.ack(message);
  });
}

await consumeAccountDeletedEvent();

type ItemTopic = "item.updated" | "item.deleted";

/**
 * Publish an item-related event into RabbitMQ.
 */
export function publishItemEvent(topic: "item.updated", body: Item): void;
export function publishItemEvent(topic: "item.deleted", body: string): void;
export function publishItemEvent(topic: ItemTopic, body: unknown) {
  channel.publish(itemExchange, topic, Buffer.from(JSON.stringify(body)), {
    persistent: true,
  });
}
