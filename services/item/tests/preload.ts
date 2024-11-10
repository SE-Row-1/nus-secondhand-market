import { afterAll, beforeAll, mock } from "bun:test";
import { existsSync } from "fs";
import { mkdir, rm } from "fs/promises";
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

beforeAll(async () => {
  if (!existsSync("uploads")) {
    await mkdir("uploads", { recursive: true });
  }
});

afterAll(async () => {
  if (existsSync("uploads")) {
    await rm("uploads", { force: true, recursive: true });
  }
});
