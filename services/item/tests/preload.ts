import { mock } from "bun:test";

mock.module("@/utils/mq", () => ({
  publishItemEvent: mock(),
}));
