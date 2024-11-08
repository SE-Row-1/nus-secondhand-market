import amqplib from "amqplib";

const connection = await amqplib.connect(Bun.env.RABBITMQ_URL);

export const channel = await connection.createChannel();

await channel.assertExchange("account", "topic");
await channel.assertExchange("item", "topic");
await channel.assertExchange("transaction", "topic");
await channel.assertExchange("notification", "topic");
await channel.assertExchange("delayed", "x-delayed-message", {
  arguments: { "x-delayed-type": "topic" },
});
