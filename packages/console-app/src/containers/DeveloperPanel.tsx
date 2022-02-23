//
// Copyright 2022 DXOS.org
//

import assert from 'assert';
import React, { useEffect, useState } from 'react';

import { Config } from '@dxos/config';
import { useClient } from '@dxos/react-client';
import { JsonTreeView } from '@dxos/react-components';
import { useAccountClient, useRegistry } from '@dxos/react-registry-client';
import { AccountKey, DXN, DxnsAccount, Resource } from '@dxos/registry-client';

import { Panel } from '../components';

/**
 * Displays the current developers account details.
 */
export const DeveloperPanel = () => {
  const client = useClient();
  const accountClient = useAccountClient();
  const [account, setAccount] = useState<DxnsAccount>();
  const [apps, setApps] = useState<Resource[]>([]);
  const registry = useRegistry();

  useEffect(() => {
    setImmediate(async () => {
      const config = new Config(await client.services.SystemService.getConfig());
      const dxnsAccount = config.get('runtime.services.dxns.account') ??
        await client.halo.getGlobalPreference('DXNSAccount');

      if (accountClient && dxnsAccount) {
        const account = await accountClient.getAccount(AccountKey.fromHex(dxnsAccount));
        setAccount(account);
      }
    });
  }, []);

  useEffect(() => {
    if (!account) {
      return;
    }
    setImmediate(async () => {
      const userDomains = (await registry.getDomains())
        .filter(domain => AccountKey.equals(domain.owner, account.id))
        .map(domain => domain.name);
      const appType = await registry.getResourceRecord(DXN.parse('dxos:type.app'), 'latest');
      assert(appType, 'Resource not found: dxos:type.app');
      const apps = await registry.queryResources({ type: appType.record.cid });
      setApps(apps.filter(app => userDomains.includes(app.id.domain)));
    });
  }, [account]);

  if (!account) {
    return null;
  }

  const data = {
    dxnsAccount: account.id,
    devices: account.devices,
    apps: apps.map(app => app.id.toString())
  };

  return (
    <Panel scroll>
      <JsonTreeView data={data} />
    </Panel>
  );
};
