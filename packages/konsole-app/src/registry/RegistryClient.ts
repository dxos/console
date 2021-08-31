//
// Copyright 2021 DXOS.org
//

import { ApiPromise, WsProvider } from '@polkadot/api';
import jsonrpc from '@polkadot/types/interfaces/jsonrpc';
import urlJoin from 'proper-url-join';

import { ChainApi, definitions } from '@dxos/registry-api';

import { IQuery, IRecord, IRecordType, IRegistryClient } from './contract';
import { IConfig } from '../hooks';

// TODO(marcin): This brings little value but mere ApiPromise creation which is to be moved to RegistryApi. And rm this.
export class RegistryClient implements IRegistryClient {
  config: IConfig;
  api: ChainApi | undefined;
  ready = false;

  constructor (config: IConfig) {
    this.config = config;
    this.connect();
  }

  async connect () {
    const types = Object.values(definitions).reduce((res, { types }): object => ({ ...res, ...types }), {});

    const provider = new WsProvider(this.config.registry.endpoint);
    const apiPromise = new ApiPromise({ provider, types, rpc: jsonrpc });

    return new Promise<void>((resolve, reject) => {
      apiPromise.on('ready', () => {
        this.ready = true;
        this.api = new ChainApi(apiPromise, undefined);
        resolve();
      });
      apiPromise.on('error', reject);
    });
  }

  async getRecordTypes (): Promise<IRecordType[]> {
    const records = await this.api?.registry.getResources() ?? [];
    const mapped = records.map(apiRecord => ({
      type: apiRecord.messageFqn,
      label: apiRecord.messageFqn
    }));
    
    const distinct = Object.values(Object.fromEntries(mapped.map(record => [record.type, record])));
    
    return distinct;
  }

  async queryRecords (query: IQuery | undefined): Promise<IRecord[]> {
    let records = (await this.api?.registry.getResources()) ?? [];

    if (query) {
      records = records.filter(record => record.messageFqn === query.type);
    }

    return records.map(apiRecord => ({
      cid: apiRecord.cid.toB58String(),
      created: Date.now().toString(), // apiRecord.data?.attributes?.created, TODO (marcin): Fix date unwrapping from the DTO.
      name: `${apiRecord.id.domain}:${apiRecord.id.resource}`,
      type: apiRecord.messageFqn,
      title: apiRecord.data?.attributes?.name,
      url: urlJoin(
          this.config.services.app.server,
          this.config.services.app.prefix,
          `${apiRecord.id.domain}:${apiRecord.id.resource}`)
    }));
  }
}
