//
// Copyright 2021 DXOS.org
//

import debug from 'debug';
import React, { useMemo } from 'react';

import { MemoryRegistryClient } from '@dxos/registry-client';

import {
  IService,
  ConfigContext,
  RegistryContext,
  RequestContext,
  ConfigPanel,
  RecordsPanel,
  ServicesPanel,
  LogsPanel,
  generateHistoricalMessages,
  logPrinter
} from '../src';

import { config, RootContainer } from './config';

debug.enable('dxos:console:*');

export default {
  title: 'Panels'
};

export const Config = () => {
  return (
    <ConfigContext.Provider value={config}>
      <RootContainer config={config}>
        <ConfigPanel />
      </RootContainer>
    </ConfigContext.Provider>
  );
};

export const Logs = () => {
  const messages = generateHistoricalMessages(100).map(logPrinter);

  const requester = async () => {
    return new Promise((resolve) => {
      setTimeout(async () => {
        resolve(messages);
      }, 100);
    });
  };

  return (
    <ConfigContext.Provider value={config}>
      <RequestContext.Provider value={[requester]}>
        <RootContainer config={config}>
          <LogsPanel />
        </RootContainer>
      </RequestContext.Provider>
    </ConfigContext.Provider>
  );
};

// TODO(burdon): Requires router for useParams, match props, etc.
export const Records = () => {
  const registryClient = useMemo(() => new MemoryRegistryClient(), []);

  return (
    <ConfigContext.Provider value={config}>
      <RegistryContext.Provider value={registryClient}>
        <RootContainer config={config}>
          <RecordsPanel />
        </RootContainer>
      </RegistryContext.Provider>
    </ConfigContext.Provider>
  );
};

export const Services = () => {
  const services: IService[] = [
    {
      name: 'service-1',
      type: 'dxos:service/app-server',
      exec: 'dx signal start',
      status: 'OK'
    },
    {
      name: 'service-2',
      type: 'dxos:service/app-server',
      exec: 'dx app-server start',
      status: 'OK'
    },
    {
      name: 'service-3',
      type: 'dxos:service/ipfs',
      exec: 'ipfs start',
      status: 'OK'
    }
  ];

  const requester = async () => {
    return new Promise((resolve) => {
      setTimeout(async () => {
        resolve(services);
      }, 100);
    });
  };

  return (
    <ConfigContext.Provider value={config}>
      <RequestContext.Provider value={[requester]}>
        <RootContainer config={config}>
          <ServicesPanel />
        </RootContainer>
      </RequestContext.Provider>
    </ConfigContext.Provider>
  );
};
