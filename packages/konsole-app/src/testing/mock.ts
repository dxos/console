//
// Copyright 2021 DXOS.org
//

import debug from 'debug';
// TODO(burdon): v5 clashes with HtmlWebpackPlugin (Error: [CaseSensitivePathsPlugin])
import faker from 'faker';

import {
  CID,
  CIDLike,
  DomainInfo,
  DomainKey,
  DXN,
  IAuctionsApi,
  IDxnsApi,
  IQuery,
  IRegistryApi,
  RegistryRecord,
  Resource,
  Filtering
} from '@dxos/registry-api';

const log = debug('dxos:console:registry');

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

const createMockResource = <T = any>(): Resource<T> => {
  const cid = CID.from(Uint8Array.from(Array.from({ length: 34 }).map(() => Math.floor(Math.random() * 255))));
  const type = faker.random.arrayElement(mockRecordTypeStrings);
  return {
    messageFqn: type,
    id: DXN.fromDomainName(faker.internet.domainWord(), faker.internet.domainWord()),
    cid: cid,
    data: { attributes: { name: faker.internet.domainWord() } } as unknown as T
  } as Resource<T>;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createMockResources = <T = any>() => Array.from({ length: 30 }).map(item => createMockResource<T>());

// TODO(marcin): Implement missing methods.
export class MockRegistryApi implements IRegistryApi {
  _resources = createMockResources();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  addRawRecord (schema: CIDLike, data: Uint8Array, messageFqn: string): Promise<CID> {
    return Promise.resolve(undefined as unknown as CID);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  addRecord (data: unknown, schemaId: CIDLike, messageFqn: string): Promise<CID> {
    return Promise.resolve(undefined as unknown as CID);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  addSchema (root: protobuf.Root): Promise<CID> {
    return Promise.resolve(undefined as unknown as CID);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  get<T = any> (id: DXN): Promise<Resource<T> | undefined> {
    return Promise.resolve(undefined);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getDomains (): Promise<DomainInfo[]> {
    return Promise.resolve([]);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getRecord<T = any> (cidLike: CIDLike): Promise<RegistryRecord<T> | undefined> {
    return Promise.resolve(undefined);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getRecords<T = any> (query?: IQuery): Promise<RegistryRecord<T>[]> {
    return Promise.resolve([]);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getResources<T = any> (query?: IQuery): Promise<Resource<T>[]> {
    log(`getResources: query = ${query}`);
    let result = this._resources as unknown as Resource<T>[];
    result = result.filter(resource => Filtering.matchesResource(resource, query));
    return Promise.resolve(result);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getSchema (cid: CIDLike): Promise<protobuf.Root | undefined> {
    return Promise.resolve(undefined);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getSchemas (): Promise<RegistryRecord[]> {
    return Promise.resolve([]);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  registerDomain (): Promise<DomainKey> {
    return Promise.resolve(undefined as unknown as DomainKey);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  registerResource (domainKey: DomainKey, resourceName: string, contentCid: CID): Promise<void> {
    return Promise.resolve(undefined);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  resolve (id: DXN): Promise<CID | undefined> {
    return Promise.resolve(undefined);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  resolveDomainName (domainName: string): Promise<DomainKey> {
    return Promise.resolve(undefined as unknown as DomainKey);
  }
}

export const MockDxnsApi = {
  registry: new MockRegistryApi(),
  auctions: undefined as unknown as IAuctionsApi // TODO(marcin): Add MockAuctionsApi.
} as IDxnsApi;
