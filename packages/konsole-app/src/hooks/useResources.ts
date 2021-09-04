//
// Copyright 2021 DXOS.org
//

import { useEffect, useState } from 'react';

import { IQuery, Resource } from '@dxos/registry-api';

import { useRegistryClient } from './useRegistry';

export function useResources (query?: IQuery): Resource[] {
  const [resources, setResources] = useState<Resource[]>([]);
  const registryClient = useRegistryClient();

  useEffect(function () {
    void registryClient.registry.getResources(query).then(setResources);
  }, [query]);

  return resources;
}
