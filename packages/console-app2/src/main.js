//
// Copyright 2021 DXOS.org
//

import React from 'react';

import JSONTree from '@dxos/react-json-tree'

import { Dimmer, Loader, Grid, Sticky, Message } from 'semantic-ui-react';

import RecordList from './components/RecordList';

import { WithChainApi } from './chain-api-context';
import { configContext } from './hooks/config';
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
    return loader('Connecting to Substrate: ' + apiState);
  }

  if (keyringState !== 'READY') {
    return loader('Loading accounts (please review any extension\'s authorization)');
  } else {
    console.log(keyring.getPairs());
  }

  return (
    <div>
      <WithChainApi accountPair={accountPair}>
        <configContext.Provider value={config}>
          <JSONTree data={config}/>
          <RecordList />
        </configContext.Provider>
      </WithChainApi>
    </div>
  );
}

export default function App () {
  const publicUrl = window.location.pathname;

  return (
    <SubstrateContextProvider>
      <Main />
    </SubstrateContextProvider>
  );
}

export default App;
