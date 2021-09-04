//
// Copyright 2021 DXOS.org
//

// import debug from 'debug';
// TODO(burdon): v5 clashes with HtmlWebpackPlugin (Error: [CaseSensitivePathsPlugin])
import faker from 'faker';

import { CID, DXN, IAuctionsApi, IDxnsApi, IQuery, IRegistryApi, Resource } from '../../../../../dot/registry-api';
// import { sortDateStrings } from '../util';
//
// const log = debug('dxos:console:registry');

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

// const createMockRecord = () => {
//   const type = faker.random.arrayElement(mockRecordTypeStrings);
//   return {
//     cid: faker.random.uuid(),
//     type,
//     created: faker.date.recent(90).toUTCString(),
//     name: `dxn:${faker.internet.domainWord()}/${faker.internet.domainWord()}`,
//     title: faker.commerce.productName(),
//     url: type === 'app' ? faker.internet.url() : undefined
//   };
// };

const createMockResource = <T = any>(): Resource => {
  const type = faker.random.arrayElement(mockRecordTypeStrings);
  return {
    messageFqn: type,
    id: DXN.fromDomainName(faker.internet.domainWord(), faker.internet.domainWord()),
    cid: CID.from(Uint8Array.from(Array.from({ length: 34 }).map(() => Math.floor(Math.random() * 255)))),
    data: {} as T
  } as Resource;
};

// const createMockRecords = () => Array.from({ length: 30 }).map(createMockRecord);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createMockResources = <T = any>() => Array.from({ length: 30 }).map(_ => createMockResource<T>());

export const mockRegistry = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getResources<T = any> (query?: IQuery): Promise<Resource<T>[]> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return new Promise((resolve, reject) => (resolve(createMockResources<T>())));
  }
} as IRegistryApi;

export const MockDxnsApi = {
  registry: mockRegistry,
  auctions: undefined as unknown as IAuctionsApi
} as IDxnsApi;

// export class MockRegistryClient implements IRegistryClient {
//   _records = createMockRecords();
//
//   getRecordTypes () : Promise<IRecordType[]> {
//     return new Promise((resolve) => resolve(mockRecordTypes));
//   }
//
//   queryRecords (query?: IQuery) : Promise<IRecord[]> {
//     const { type, text } = query || {};
//     const lowerText = text?.toLowerCase();
//     log('Query:', query);
//
//     // TODO(burdon): Add configuration to test registry state having changed.
//     // this._records.push(createMockRecord());
//
//     return new Promise((resolve) => resolve(this._records
//       .filter(record => {
//         if (!type || type === '*') {
//           return true;
//         } else {
//           return record.type === type;
//         }
//       })
//       .filter(record => {
//         return !lowerText ||
//           record.name.toLowerCase().indexOf(lowerText) !== -1 ||
//           record.title.toLowerCase().indexOf(lowerText) !== -1;
//       })
//       .sort((v1, v2) => {
//         return sortDateStrings(v1.created, v2.created);
//       })));
//   }
// }
