import { mock } from "bun:test";
import { ObjectId } from "mongodb";

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

if (!Bun.env.INTEGRATION_TEST) {
  mock.module("mongodb", () => ({
    MongoClient: {
      connect: () => ({
        db: () => ({
          collection: () => ({
            find: () => ({ toArray: () => [] }),
            findOne: () => {},
            insertOne: () => {},
            insertMany: () => {},
            updateOne: () => {},
            updateMany: () => {},
            deleteOne: () => {},
            deleteMany: () => {},
          }),
        }),
      }),
    },
    ObjectId,
  }));
}
