import type { Item } from "@/types";
import { channel, itemExchange } from "./init";

export function publishItemUpdatedEvent(updatedItem: Item) {
  channel.publish(
    itemExchange,
    "item.updated",
    Buffer.from(JSON.stringify(updatedItem)),
    {
      persistent: true,
    },
  );
}
