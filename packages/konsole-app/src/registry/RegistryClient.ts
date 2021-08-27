//
// Copyright 2021 DXOS.org
//

import { ApiPromise, WsProvider } from '@polkadot/api';
import jsonrpc from '@polkadot/types/interfaces/jsonrpc';

import { ChainApi, definitions } from '@dxos/registry-api';

import { IQuery, IRecord, IRecordType, IRegistryClient } from './contract';


export class RegistryClient implements IRegistryClient {
  _endpoint: string;
  api: any;
  ready: boolean = false;

  constructor ({ endpoint, types } : {endpoint: string, types?: object}) {
    this._endpoint = endpoint;
    this.connect();
  }

  async connect() {
    const types = Object.values(definitions).reduce((res, { types }): object => ({ ...res, ...types }), {});

    const provider = new WsProvider(this._endpoint);
    const apiPromise = new ApiPromise({ provider, types, rpc: jsonrpc });

    return new Promise<void>((resolve, reject) => {
      apiPromise.on('ready', () => {
        this.ready = true;
        this.api = new ChainApi(apiPromise, undefined);
        resolve();
      });
      apiPromise.on('error', reject);
    })
  }

  async getRecordTypes (): Promise<IRecordType[]> {
    const records = await this.api?.registry.getRecords() ?? [];
    return records.map((apiRecord: any) => ({
      type: apiRecord.messageFqn,
      label: apiRecord.messageFqn
    }));
  }

  async queryRecords (query: IQuery | undefined): Promise<IRecord[]> {
    let records = (await this.api?.registry.getRecords()) ?? [];

    if (query) {
      records = records.filter((r:any) => r.messageFqn === query.type);
    }

    return records.map((apiRecord: any) => ({
      cid: apiRecord.cid.toB58String(),
      name: apiRecord.cid.toB58String(),
      type: apiRecord.messageFqn,
      title: apiRecord.cid.toB58String()
    }));
  }
}
