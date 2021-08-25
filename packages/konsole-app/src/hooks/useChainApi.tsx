//
// Copyright 2021 DXOS.org
//

import { web3FromSource } from '@polkadot/extension-dapp';
import React, { useContext, useEffect, useState } from 'react';

import { ChainApi } from '@dxos/registry-api';

import { useSubstrate } from '../substrate-lib';

const ChainApiContext = React.createContext(undefined);

const useChainApi = () => useContext(ChainApiContext);

function WithChainApi ({ children, accountPair }) {
  const { api } = useSubstrate();
  const [chainApi, setChainApi] = useState(undefined);

  useEffect(() => {
    if (!api) {
      return;
    }
    const runEffect = async () => {
      if (!accountPair) {
        return;
      }
      const {
        address,
        meta: { source, isInjected }
      } = accountPair;
      let fromAcct;

      // Signer is from Polkadot-js browser extension.
      if (isInjected) {
        const injected = await web3FromSource(source);
        fromAcct = address;
        api.setSigner(injected.signer);
      } else {
        fromAcct = accountPair;
      }

      setChainApi(new ChainApi(api, fromAcct));
    };
    runEffect();
  }, [accountPair, api]);

  return (
    <ChainApiContext.Provider value={chainApi}>
      {children}
    </ChainApiContext.Provider>
  );
}

export { WithChainApi, useChainApi };
