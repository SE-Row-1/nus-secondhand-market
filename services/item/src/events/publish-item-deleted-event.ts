import { channel, itemExchange } from "./init";

export function publishItemDeletedEvent(deletedItemId: string) {
  channel.publish(
    itemExchange,
    "item.deleted",
    Buffer.from(JSON.stringify(deletedItemId)),
    {
      persistent: true,
    },
  );
}
