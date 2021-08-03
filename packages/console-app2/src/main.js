//
// Copyright 2021 DXOS.org
//

import React from 'react';

import JSONTree from '@dxos/react-json-tree'

import { Dimmer, Loader, Grid, Message } from 'semantic-ui-react';

import ResourceList from './components/ResourceList';

import { WithChainApi } from './hooks/chain-api';
import { SubstrateContextProvider, useSubstrate } from './substrate-lib';

function Main({ config }) {
  const { keyring, keyringState, apiState } = useSubstrate();

  const accountPair = keyringState === 'READY' ? keyring.getPairs()[0] : null;

  const loader = text =>
    <Dimmer active>
      <Loader size='small'>{text}</Loader>
    </Dimmer>;

  const message = err =>
    <Grid centered columns={2} padded>
      <Grid.Column>
        <Message negative compact floating
          header='Error Connecting to Substrate'
          content={`${JSON.stringify(err, null, 4)}`}
        />
      </Grid.Column>
    </Grid>;

  if (apiState === 'ERROR') {
    return message(apiError);
  } else if (apiState !== 'READY') {
    return loader('Connecting to Substrate');
  }

  if (keyringState !== 'READY') {
    return loader('Loading accounts (please review any extension\'s authorization)');
  }

  return (
    <div>
      <WithChainApi accountPair={accountPair}>
          <h1>Records</h1>
          <ResourceList config={config}/>
          <h1>Config</h1>
          <JSONTree data={config}/>
      </WithChainApi>
    </div>
  );
}

export default function App ({ config }) {
  return (
      <SubstrateContextProvider config={config}>
        <Main config={config} />
      </SubstrateContextProvider>
  );
}

export default App;
