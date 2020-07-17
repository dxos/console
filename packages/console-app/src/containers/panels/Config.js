//
// Copyright 2020 DXOS.org
//

import React, { useContext } from 'react';

import { ConsoleContext } from '../../hooks';

import Panel from '../../components/Panel';
import Toolbar from '../../components/Toolbar';
import Json from '../../components/Json';

const Config = () => {
  const { config } = useContext(ConsoleContext);

  return (
    <Panel
      toolbar={
        <Toolbar />
      }
    >
      <Json data={config} />
    </Panel>
  );
};

export default Config;
