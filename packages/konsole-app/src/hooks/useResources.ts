//
// Copyright 2021 DXOS.org
//

import { useEffect, useState } from 'react';

import { IQuery, Resource } from '@dxos/registry-api';

import { useRegistryClient } from './useRegistry';

export const useResources = (query?: IQuery): Resource[] => {
  const [resources, setResources] = useState<Resource[]>([]);
  const registryClient = useRegistryClient();

  useEffect(() => {
    setImmediate(async () => {
      const resources = await registryClient.getResources(query);
      setResources(resources);
    });
  }, [query]);

  return resources;
};
