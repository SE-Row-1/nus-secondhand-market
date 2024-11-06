import amqplib from "amqplib";

const connection = await amqplib.connect(Bun.env.RABBITMQ_URL);

export const channel = await connection.createChannel();

export const { exchange: accountExchange } = await channel.assertExchange(
  "account",
  "topic",
);
console.log(`Asserted exchange "${accountExchange}"`);

export const { exchange: itemExchange } = await channel.assertExchange(
  "item",
  "topic",
);
console.log(`Asserted exchange "${itemExchange}"`);

export const { exchange: delayedExchange } = await channel.assertExchange(
  "delayed",
  "x-delayed-message",
  {
    arguments: {
      "x-delayed-type": "topic",
    },
  },
);
console.log(`Asserted exchange "${delayedExchange}"`);
