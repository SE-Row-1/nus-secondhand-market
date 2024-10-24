import { mock } from "bun:test";

mock.module("@/events/consume-account-updated-event", () => ({
  consumeAccountUpdatedEvent: mock(),
}));

mock.module("@/events/consume-account-deleted-event", () => ({
  consumeAccountDeletedEvent: mock(),
}));

mock.module("@/events/publish-item-updated-event", () => ({
  publishItemUpdatedEvent: mock(),
}));

mock.module("@/events/publish-item-deleted-event", () => ({
  publishItemDeletedEvent: mock(),
}));
