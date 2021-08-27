//
// Copyright 2021 DXOS.org
//

import { ApiPromise, WsProvider } from '@polkadot/api';
import jsonrpc from '@polkadot/types/interfaces/jsonrpc';

import { ChainApi, definitions } from '@dxos/registry-api';

import { IQuery, IRecord, IRecordType, IRegistryClient } from './contract';

interface ClientState {
  endpoint: string,
  jsonrpc: any,
  types: any,
  api: null | ChainApi,
  apiError: null | string,
  apiState: null | string
  connectionAttempted: boolean
}

const INIT_STATE: ClientState = {
  endpoint: '',
  jsonrpc: { ...jsonrpc },
  types: null,
  api: null,
  apiError: null,
  apiState: null,
  connectionAttempted: false
};

type Action =
  | { type: 'CONNECT_INIT' }
  | { type: 'CONNECT', api: ApiPromise }
  | { type: 'CONNECT_SUCCESS'}
  | { type: 'CONNECT_ERROR', error: any }

const reducer = (state: ClientState, action: Action): ClientState => {
  switch (action.type) {
    case 'CONNECT_INIT':
      return { ...state, apiState: 'connecting', connectionAttempted: true };

    case 'CONNECT':
      return { ...state, api: new ChainApi(action.api, undefined), apiState: 'connecting' };

    case 'CONNECT_SUCCESS':
      return { ...state, apiState: 'ready' };

    case 'CONNECT_ERROR':
      return { ...state, apiState: 'error', apiError: action.error };
  }
};

const connect = (state: ClientState, dispatch: (action: Action) => void) => {
  const { connectionAttempted, endpoint, jsonrpc, types } = state;

  // TODO(marcin): can't just return without note for user
  if (!endpoint) {
    return;
  }

  // We only want this function to be performed once.
  if (connectionAttempted) {
    return;
  }

  dispatch({ type: 'CONNECT_INIT' });

  const typesWithDefinitions = Object.values(definitions).reduce((res, { types }) => ({ ...res, ...types }), types);

  const provider = new WsProvider(endpoint);
  const apiPromise = new ApiPromise({ provider, types: typesWithDefinitions, rpc: jsonrpc });

  // Set listeners for disconnection and reconnection event.
  apiPromise.on('connected', () => {
    dispatch({ type: 'CONNECT', api: apiPromise });
    // `ready` event is not emitted upon reconnection and is checked explicitly here.
    apiPromise.isReady.then(() => dispatch({ type: 'CONNECT_SUCCESS' }));
  });
  apiPromise.on('ready', () => dispatch({ type: 'CONNECT_SUCCESS' }));
  apiPromise.on('error', err => dispatch({ type: 'CONNECT_ERROR', error: err }));
};

export class RegistryClient implements IRegistryClient {
  private state: ClientState;

  constructor ({ endpoint, types } : {endpoint: string, types?: object}) {
    this.state = { ...INIT_STATE, endpoint, types };

    // TODO(marcin) How to communicate state transition to end users in order to start querying only when state = ready

    connect(this.state, this.useReducer());
  }

  useReducer () : (action: Action) => void {
    const dispatch = (action: Action) => {
      this.state = reducer(this.state, action);
    };
    return dispatch;
  }

  async getRecordTypes (): Promise<IRecordType[]> {
    const records = await this.state.api?.registry.getRecords() ?? [];
    return records.map(apiRecord => ({
      type: apiRecord.messageFqn,
      label: apiRecord.messageFqn
    }));
  }

  async queryRecords (query: IQuery | undefined): Promise<IRecord[]> {
    let records = (await this.state.api?.registry.getRecords()) ?? [];

    if (query) {
      records = records.filter(r => r.messageFqn === query.type);
    }

    return records.map(apiRecord => ({
      cid: apiRecord.cid.toB58String(),
      name: apiRecord.cid.toB58String(),
      type: apiRecord.messageFqn,
      title: apiRecord.cid.toB58String()
    }));
  }
}
