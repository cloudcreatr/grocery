// utils/pubsub.ts
import { EventEmitter, on } from "node:events";

export class PubSub {
  private ee = new EventEmitter();

  publish<T = any>(topic: string, data: T) {
    this.ee.emit(topic, data);
  }

  subscribe<T = any>(topic: string): AsyncIterable<[T]> {
    return on(this.ee, topic) as AsyncIterable<[T]>;
  }
}

// export a shared instance
export const pubsub = new PubSub();
