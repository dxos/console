//
// Copyright 2021 DXOS.org
//

import { generateHistoricalMessages, LogBuffer } from './logging';

test('LogBuffer', () => {
  const buffer = new LogBuffer(100);

  buffer.append(generateHistoricalMessages(10));
  expect(buffer.messages.length).toBe(10);
  expect(buffer.length).toBe(10);

  buffer.clear();
  expect(buffer.length).toBe(0);

  buffer.append(generateHistoricalMessages(30));
  buffer.append(generateHistoricalMessages(30));
  buffer.append(generateHistoricalMessages(30));
  expect(buffer.length).toBe(90);

  buffer.append(generateHistoricalMessages(30));
  expect(buffer.length).toBe(100);
});

// TODO(burdon): Parse string.
// TODO(burdon): Diff when retrieving from server.
