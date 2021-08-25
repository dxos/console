//
// Copyright 2020 DXOS.org
//

import React from 'react';
import ReactDOM from 'react-dom';

import { App as ActualApp, Root } from './components';
import { loadConfig } from './config';

// Rename ActualApp
import { ConfigContext } from './hooks';
import { WithChainApi } from './hooks/useChainApi';
import { SubstrateContextProvider, useSubstrate } from './substrate-lib';

function WithChainMain ({ config }) {
  const { keyring, keyringState, apiState } = useSubstrate();

  const accountPair = keyringState === 'READY' ? keyring.getPairs()[0] : null;

  if (apiState === 'ERROR') {
    return <div>Api error</div>;
  } else if (apiState !== 'READY') {
    return <div>Connecting to Substrate</div>;
  }

  if (keyringState !== 'READY') {
    return <div>Loading accounts (please review any extension authorization)</div>;
  }

  return (
    <div>
      <WithChainApi accountPair={accountPair}>
        <ActualApp/>
      </WithChainApi>
    </div>
  );
}

const App = ({ config }) => {
  return (
    <ConfigContext.Provider value={config}>
      <Root>
        <SubstrateContextProvider config={config}>
          <WithChainMain config={config} />
        </SubstrateContextProvider>
      </Root>
    </ConfigContext.Provider>);
};

loadConfig().then(config => {
  ReactDOM.render(<App config={config.values} />, document.querySelector('#root'));
});
