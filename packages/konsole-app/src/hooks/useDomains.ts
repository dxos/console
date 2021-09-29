//
// Copyright 2021 DXOS.org
//

import { useEffect, useState } from 'react';

// TODO(burdon): Rename Domain?
import { DomainInfo } from '@dxos/registry-api';

import { useRegistryClient } from './useRegistry';

export const useDomains = (): DomainInfo[] => {
  const [domains, setDomains] = useState<DomainInfo[]>([]);
  const registryClient = useRegistryClient();

  useEffect(() => {
    setImmediate(async () => {
      const domains = await registryClient.getDomains();
      setDomains(domains);
    });
  }, []);

  return domains;
};
