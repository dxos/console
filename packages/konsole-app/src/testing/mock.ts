//
// Copyright 2020 DXOS.org
//

// TODO(burdon): v5 clashes with HtmlWebpackPlugin (Error: [CaseSensitivePathsPlugin])
import faker from 'faker';

import { IRegistryClient, IQuery } from '../hooks';
import { sortDateStrings } from '../util';

export const mockRecordTypes = [
  {
    type: '*',
    label: 'ALL'
  },
  {
    type: 'schema',
    label: 'Schema'
  },
  {
    type: 'kube',
    label: 'KUBE'
  },
  {
    type: 'service',
    label: 'KUBE Service'
  },
  {
    type: 'file',
    label: 'File'
  },
  {
    type: 'app',
    label: 'App'
  },
  {
    type: 'bot',
    label: 'Bot'
  }
];

const mockRecordTypeStrings = mockRecordTypes.slice(1).map(({ type }) => type);

const createMockRecord = () => {
  const type = faker.random.arrayElement(mockRecordTypeStrings);
  return {
    cid: faker.random.uuid(),
    type,
    created: faker.date.recent(90).toUTCString(),
    name: `dxn:/${faker.internet.domainWord()}/${faker.internet.domainWord()}`,
    title: faker.commerce.productName(),
    url: type === 'app' ? faker.internet.url() : undefined
  };
}

const createMockRecords = () => Array.from({ length: 30 }).map(createMockRecord);

export class MockRegistryClient implements IRegistryClient {
  _records = createMockRecords();

  getRecordTypes () {
    return mockRecordTypes;
  }

  queryRecords (query?: IQuery) {
    const { type } = query || {};

    // TODO(burdon): Add configuration to test registry state having changed.
    // this._records.push(createMockRecord());

    return this._records.filter(recordType => {
      if (!type || type === '*') {
        return true;
      } else {
        return recordType.type === type;
      }
    }).sort((v1, v2) => {
      return sortDateStrings(v1.created, v2.created);
    });
  }
}
