import { channel } from "./init";

export function publishEvent(exchange: string, topic: string, data: unknown) {
  channel.publish(exchange, topic, Buffer.from(JSON.stringify(data)), {
    persistent: true,
  });

  console.log(`Published to [Topic ${topic}]@[Exchange ${exchange}]`);
}
