//
// Copyright 2021 DXOS.org
//

import { useEffect, useState } from 'react';

import { IQuery, Resource } from '@dxos/registry-api';

import { useRegistryClient } from './useRegistry';

export function useResources (query?: IQuery): Resource[] | undefined {
  const [resources, setResources] = useState<Resource[] | undefined>(undefined);
  const registryClient = useRegistryClient();

  useEffect(function () {
    void registryClient.getResources(query).then(setResources);
  }, [query]);

  return resources;
}
