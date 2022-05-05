//
// Copyright 2021 DXOS.org
//

import React, { useState } from 'react';

import { useBotFactoryClient } from '@dxos/react-client';

import { BotLogs } from '../components/BotLogs';
import { BotsTable } from '../components/BotsTable';

export const BotsPanel = () => {
  const botClient = useBotFactoryClient(true);
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
