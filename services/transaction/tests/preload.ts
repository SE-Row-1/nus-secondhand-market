import { mock } from "bun:test";

mock.module("amqplib", () => ({
  default: {
    connect: () => ({
      createChannel: () => ({
        assertExchange: () => {},
        assertQueue: () => ({ queue: "mock" }),
        bindQueue: () => {},
        publish: () => {},
        consume: () => {},
      }),
    }),
  },
}));
