//
// Copyright 2021 DXOS.org
//

import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import jsonrpc from '@polkadot/types/interfaces/jsonrpc';
import keyring from '@polkadot/ui-keyring';
import React, { useReducer, useContext } from 'react';

import { definitions } from '@dxos/registry-api';

// Initial state for `useReducer`.

export interface SubstrateState {
  config: any,
  socket: any,
  jsonrpc: any,
  types: any,
  keyring: null | any,
  keyringState: null | string,
  api: null | ApiPromise,
  apiError: null | string,
  apiState: null | string
  connectionAttempted: boolean
}

const INIT_STATE: SubstrateState = {
  config: null,
  socket: null,
  jsonrpc: { ...jsonrpc },
  types: null,
  keyring: null,
  keyringState: null,
  api: null,
  apiError: null,
  apiState: null,
  connectionAttempted: false
};

// Reducer function for `useReducer`.

const reducer = (state: SubstrateState, action) => {
  switch (action.type) {
    case 'CONFIG_INIT':
      return { ...state, apiState: 'CONFIG_INIT', config: action.payload, socket: action.payload.services.dxns.server, types: action.payload.types };

    case 'CONNECT_INIT':
      return { ...state, apiState: 'CONNECT_INIT', connectionAttempted: true };

    case 'CONNECT':
      return { ...state, api: action.payload, apiState: 'CONNECTING' };

    case 'CONNECT_SUCCESS':
      return { ...state, apiState: 'READY' };

    case 'CONNECT_ERROR':
      return { ...state, apiState: 'ERROR', apiError: action.payload };

    case 'LOAD_KEYRING':
      return { ...state, keyringState: 'LOADING' };

    case 'SET_KEYRING':
      return { ...state, keyring: action.payload, keyringState: 'READY' };

    case 'KEYRING_ERROR':
      return { ...state, keyring: null, keyringState: 'ERROR' };

    default:
      throw new Error(`Unknown type: ${action.type}`);
  }
};

// Connecting to the Substrate node.

const connect = (state, dispatch) => {
  const { connectionAttempted, socket, jsonrpc, types } = state;

  if (!socket) {
    return;
  }

  // We only want this function to be performed once.
  if (connectionAttempted) {
    return;
  }

  dispatch({ type: 'CONNECT_INIT' });

  const typesWithDefinitions = Object.values(definitions).reduce((res, { types }) => ({ ...res, ...types }), types);

  const provider = new WsProvider(socket);
  const _api = new ApiPromise({ provider, types: typesWithDefinitions, rpc: jsonrpc });

  // Set listeners for disconnection and reconnection event.
  _api.on('connected', () => {
    dispatch({ type: 'CONNECT', payload: _api });
    // `ready` event is not emitted upon reconnection and is checked explicitly here.
    _api.isReady.then(() => dispatch({ type: 'CONNECT_SUCCESS' }));
  });
  _api.on('ready', () => dispatch({ type: 'CONNECT_SUCCESS' }));
  _api.on('error', err => dispatch({ type: 'CONNECT_ERROR', payload: err }));
};

// Loading accounts from dev and polkadot-js extension.

let loadAccts = false;
const loadAccounts = (state, dispatch) => {
  const { config } = state;
  if (!config) {
    return;
  }

  const asyncLoadAccounts = async () => {
    dispatch({ type: 'LOAD_KEYRING' });

    try {
      await web3Enable(config.app.title);
      let allAccounts = await web3Accounts();
      allAccounts = allAccounts.map(({ address, meta }) =>
        ({ address, meta: { ...meta, name: `${meta.name} (${meta.source})` } }));
      keyring.loadAll({ isDevelopment: config.devKeyring }, allAccounts);
      dispatch({ type: 'SET_KEYRING', payload: keyring });
    } catch (e) {
      console.error(e);
      dispatch({ type: 'KEYRING_ERROR' });
    }
  };

  const { keyringState } = state;
  // If `keyringState` is not null `asyncLoadAccounts` is running.
  if (keyringState) {
    return;
  }
  // If `loadAccts` is true, the `asyncLoadAccounts` has been run once.
  if (loadAccts) {
    return dispatch({ type: 'SET_KEYRING', payload: keyring });
  }

  // This is the heavy duty work.
  loadAccts = true;
  asyncLoadAccounts();
};

const setConfig = (state: SubstrateState, dispatch, conf) => {
  const { config } = state;
  if (config) {
    return;
  }

  dispatch({ type: 'CONFIG_INIT', payload: conf });
};

const SubstrateContext = React.createContext<SubstrateState>(INIT_STATE);

interface Props {
  socket?: string;
  types?: object;
  config: object;
  children: React.ReactNode;
}

const SubstrateContextProvider = (props: Props) => {
  // Filtering props and merge with default param value.
  const initState: SubstrateState = { ...INIT_STATE };
  const neededPropNames = ['socket', 'types'];
  neededPropNames.forEach(key => {
    initState[key] = (typeof props[key] === 'undefined' ? initState[key] : props[key]);
  });

  const [state, dispatch] = useReducer(reducer, initState);

  setConfig(state, dispatch, props.config);

  connect(state, dispatch);
  loadAccounts(state, dispatch);

  return <SubstrateContext.Provider value={state}>
    {props.children}
  </SubstrateContext.Provider>;
};

const useSubstrate = () => useContext(SubstrateContext);

export { SubstrateContextProvider, useSubstrate };
