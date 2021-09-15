//
// Copyright 2021 DXOS.org
//

import faker from 'faker';
import { useEffect, useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';

// Data types

export interface ILogMessage {
  id: string
  timestamp: string
  delta?: number
  level: string // TODO(burdon): Extend to `debug` library's location (e.g., foo:bar).
  message: string
}

export interface IFilter {
  filterKey: keyof ILogMessage | undefined
  filterValue: string | undefined
}

export const logLevels = [ // TODO(burdon): Compute dynamically (e.g., general notion of location).
  'DEBUG', 'INFO', 'WARN', 'ERROR'
];

/**
 * Limited size buffer of messages.
 */
// TODO(burdon): Not currently used.
export class LogBuffer {
  private readonly _messages: ILogMessage[] = [];

  constructor (private readonly _size: number = 500) {}

  clear () {
    this._messages.length = 0;
  }

  /**
   * Append messages in increasing time order.
   */
  append (messages: ILogMessage[]) {
    this._messages.splice(this._messages.length - 1, 0, ...messages);
    this._messages.splice(0, Math.max(0, this._messages.length - this._size));
  }

  get length () {
    return this._messages.length;
  }

  get messages () {
    return this._messages;
  }
}

export const generateMessage = (ts: number, previous?: number): ILogMessage => ({
  id: uuid(),
  timestamp: new Date(ts).toISOString(),
  delta: previous ? (ts - previous) : undefined,
  level: faker.random.arrayElement(logLevels),
  message: faker.lorem.sentences().split('.').filter(Boolean).join('.\n') + '.'
});

export const generateHistoricalMessages = (n: number, ts: number = Date.now()) => {
  let start = ts;
  const times = [...new Array(n)].map(() => {
    const next = start - Math.abs(Math.random() * 12) * 3600 * 1000;
    start = next;
    return next;
  }).reverse();

  let last: ILogMessage | undefined;
  return times.map(ts => {
    last = generateMessage(ts, last ? new Date(last.timestamp).getTime() : undefined);
    return last;
  });
};

/**
 * Generate test messages.
 * @param initial Number of initial messages.
 * @param delay Time delay to generate new messages.
 */
export const useTestMessages = (initial = 100, delay = 0) => {
  const [messages, setMessages] = useState(generateHistoricalMessages(initial));
  const messagesRef = useRef(messages);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;

    const trigger = () => {
      t = setTimeout(() => {
        messagesRef.current = [
          ...messagesRef.current,
          generateMessage(Date.now(), new Date(messagesRef.current[messagesRef.current.length - 1].timestamp).getTime())
        ];
        setMessages(messagesRef.current);
        trigger();
      }, faker.random.number(delay));
    };

    if (delay) {
      trigger();
    }

    return () => clearTimeout(t);
  }, []);

  return messagesRef.current;
};
