//
// Copyright 2021 DXOS.org
//

import debug from 'debug';
import faker from 'faker';
import { useEffect, useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';

const log = debug('dxos:console:warn');

// Data types

export interface ILogMessage {
  id: string
  timestamp: string
  delta?: number
  level?: string // TODO(burdon): Extend to `debug` library's location (e.g., foo:bar).
  message: string
}

export interface IFilter {
  filterKey: keyof ILogMessage | undefined
  filterValue: string | undefined
}

// TODO(burdon): Compute dynamically (e.g., general notion of location).
export const logLevels = [
  'DEBUG', 'INFO', 'WARN', 'ERROR'
];

// TODO(burdon): Make use of LogParser as it's not used.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type LogParser = (line: string, previous?: Date) => ILogMessage;

const createInvalidLogMessage = (line: string) => {
  log(`Failed to parse: ${line}`);
  return {
    id: uuid(),
    timestamp: 'N/A',
    level: 'N/A',
    message: line
  };
};

// TODO(burdon): Make use of `previous` as it's not used now.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const createLogParser = (regex: RegExp) => (line: string, previous?: Date) => {
  const parts = line.match(regex);
  if (!parts) {
    return createInvalidLogMessage(line);
  }

  return {
    id: uuid(),
    timestamp: parts[1],
    delta: 0,
    level: parts[2],
    message: parts[3]
  };
};

// TODO(burdon): Fix multi-line (see below).
export const logPrinter = ({ timestamp, level, message }: ILogMessage) => `${timestamp} ${level} ${message.replace(/[\r\n]/g, '')}`;

//
// Test: https://regexr.com
//

// Example: "2021-09-14T20:53:46.632038879Z   dxos:cli-app:server:auth Not authenticated. +1s\r"
// Skip +1ms at end.
// TODO(burdon): Doesn't match multi-line (i.e., text with \n breaks).
export const defaultLogParser = createLogParser(/^([^\s]+)\s+([^\s]+)\s(.+?)(\s\+.+|$)/);

// Example: "2021-09-14 09:01:54.305: Initializing daemon..."
export const ipfsLogParser = (line: string) => {
  const regex = /^([^\s]+) ([^\s]+) (.*)$/;
  const parts = line.match(regex);
  if (!parts) {
    return createInvalidLogMessage(line);
  }

  const ts = new Date(`${parts[1]}T${parts[2].slice(0, -1)}Z`);
  return {
    id: uuid(),
    timestamp: ts.toISOString(),
    level: 'INFO', // TODO(burdon): Optional.
    message: parts[3]
  };
};

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
