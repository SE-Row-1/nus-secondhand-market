import type { Item } from "@/types";
import amqplib from "amqplib";

const connection = await amqplib.connect(Bun.env.RABBITMQ_URL);
const channel = await connection.createChannel();
const itemExchange = await channel.assertExchange("item", "topic");

type ItemTopic = "updated" | "deleted";

/**
 * Publish an item-related event into RabbitMQ.
 */
export function publishItemEvent(topic: "updated", body: Item): void;
export function publishItemEvent(topic: "deleted", body: string): void;
export function publishItemEvent(topic: ItemTopic, body: unknown) {
  channel.publish(
    itemExchange.exchange,
    topic,
    Buffer.from(JSON.stringify(body)),
    { persistent: true },
  );
}
