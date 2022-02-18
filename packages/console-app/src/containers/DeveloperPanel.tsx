//
// Copyright 2022 DXOS.org
//

import React, { useEffect, useState } from 'react';

import { useClient } from '@dxos/react-client';
import { JsonTreeView } from '@dxos/react-components';
import { useAccountClient } from '@dxos/react-registry-client';
import { AccountKey, DxnsAccount } from '@dxos/registry-client';

import { Panel } from '../components';

/**
 * Displays the current developers account details.
 */
export const DeveloperPanel = () => {
  const client = useClient();
  const accountClient = useAccountClient();
  const [account, setAccount] = useState<DxnsAccount>();

  useEffect(() => {
    setImmediate(async () => {
      const config = await client.services.SystemService.getConfig();
      const dxnsAccount = config?.runtime?.services?.dxns?.dxnsAccount;

      if (accountClient && dxnsAccount) {
        const account = await accountClient.getAccount(AccountKey.fromHex(dxnsAccount));
        setAccount(account);
      }
    });
  }, []);

  if (!account) {
    return null;
  }

  return (
    <Panel scroll>
      <JsonTreeView data={account} />
    </Panel>
  );
};
