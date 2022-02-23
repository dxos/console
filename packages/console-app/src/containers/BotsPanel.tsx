//
// Copyright 2021 DXOS.org
//

import React, { useState } from 'react';

import { useBotFactoryClient } from '@dxos/react-client';

import { BotLogs } from '../components/BotLogs';
import { BotsTable } from '../components/BotsTable';
import { useConfig } from '../hooks';

export const BotsPanel = () => {
  const config = useConfig();
  const botClient = useBotFactoryClient(config);
  const [selectedBot, setSelectedBot] = useState<string | undefined>();

  if (!botClient) {
    return <div> Establishing connection with bot factory... </div>;
  }

  if (selectedBot) {
    return (
      <BotLogs
        selectedBot={selectedBot}
        selectBot={setSelectedBot}
        botClient={botClient}
      />
    );
  }

  return <BotsTable selectBot={setSelectedBot} botClient={botClient} />;
};
