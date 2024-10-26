import { mock } from "bun:test";

mock.module("@/events/consume-account-updated-event", () => ({
  consumeAccountUpdatedEvent: mock(),
}));

mock.module("@/events/consume-account-deleted-event", () => ({
  consumeAccountDeletedEvent: mock(),
}));

mock.module("@/events/consume-transaction-auto-completed-event", () => ({
  consumeTransactionAutoCompletedEvent: mock(),
}));

mock.module("@/events/publish-item-updated-event", () => ({
  publishItemUpdatedEvent: mock(),
}));

mock.module("@/events/publish-item-deleted-event", () => ({
  publishItemDeletedEvent: mock(),
}));

mock.module("@/events/publish-transaction-auto-completed-event", () => ({
  publishTransactionAutoCompletedEvent: mock(),
}));
