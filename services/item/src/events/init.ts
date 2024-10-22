import amqplib from "amqplib";

const connection = await amqplib.connect(Bun.env.RABBITMQ_URL);

export const channel = await connection.createChannel();

export const { exchange: accountExchange } = await channel.assertExchange(
  "account",
  "topic",
);

export const { exchange: itemExchange } = await channel.assertExchange(
  "item",
  "topic",
);
