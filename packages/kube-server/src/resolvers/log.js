//
// Copyright 2021 DXOS.org
//

import { getLogs } from '../handlers';

export const logResolvers = {
  Query: {
    logs: async (_, { service, incremental }) => {
      const lines = await getLogs({ name: service, incremental });
      return {
        timestamp: new Date().toUTCString(),
        json: JSON.stringify({ incremental, lines })
      };
    }
  }
};
