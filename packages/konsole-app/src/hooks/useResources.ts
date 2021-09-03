//
// Copyright 2021 DXOS.org
//

import { useEffect, useState } from 'react';

import { Resource } from '@dxos/registry-api';

import { useRegistryClient } from './useRegistry';

export function useResources (): Resource[] {
  const [resources, setResources] = useState<Resource[]>([]);
  const registryClient = useRegistryClient();

  useEffect(function () {
    void registryClient.registry.getResources().then(setResources);
  }, []);

  return resources;
}
