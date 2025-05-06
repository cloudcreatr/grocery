// utils/pubsub.ts
import { EventEmitter, on } from "node:events";

export class PubSub {
  private ee = new EventEmitter();
  constructor() {
    // Increase the maximum number of listeners.
    // Adjust this value based on your expected number of concurrent subscribers.
    // Setting to 0 means unlimited, but a specific higher number is often safer.
    this.ee.setMaxListeners(50);
  }

  publish<T = any>(topic: string, data: T) {
    this.ee.emit(topic, data);
  }

  subscribe<T = any>(topic: string): AsyncIterable<[T]> {
    return on(this.ee, topic) as AsyncIterable<[T]>;
  }
}

// export a shared instance
export const pubsub = new PubSub();
