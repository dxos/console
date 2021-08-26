//
// Copyright 2020 DXOS.org
//

// TODO(burdon): v5 clashes with HtmlWebpackPlugin (Error: [CaseSensitivePathsPlugin])
import faker from 'faker';

import { IQuery, IRegistryClient } from '../registry';

export const mockRecordTypes = [
  {
    type: '*',
    label: 'ALL'
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
    type: 'app',
    label: 'App'
  }
];

const mockRecordTypeStrings = mockRecordTypes.slice(1).map(({ type }) => type);

export const mockRecords = Array.from({ length: 20 }).map(() => ({
  cid: faker.random.uuid(),
  name: `dxn:/${faker.internet.domainWord()}/${faker.system.directoryPath()}`,
  type: faker.random.arrayElement(mockRecordTypeStrings),
  title: faker.commerce.productName()
}));

export class MockRegistryClient implements IRegistryClient {
  getRecordTypes () {
    return mockRecordTypes;
  }

  queryRecords (query?: IQuery) {
    const { type } = query || {};
    return mockRecords.filter(recordType => {
      if (!type || type === '*') {
        return true;
      } else {
        return recordType.type === type;
      }
    });
  }
}
