//
// Copyright 2021 DXOS.org
//

import { useQuery } from 'graphql-hooks';
import React from 'react';

import { JsonTreeView } from '@dxos/react-components';

import { Panel } from '../components';

const SIGNAL_QUERY = `query {
  signal_status: status {
    id
    updatedAt,
    nodes {
      id
      kubeStatus {
        system {
          version

          memory {
            total
            used
          }

          network {
            hostname
          }

          time {
            up
          }

          nodejs {
            version
          }
        }
        services {
          name
          status
        }
      }
      connections {
        id
        target
      }
      signal {
        topics {
          id
          peers
        }
      }
    }
  }
}`;

/**
 * Displays the status of the signaling servers.
 */
export const SignalingPanel = () => {
  const { data } = useQuery(SIGNAL_QUERY);

  return (
    <Panel>
      {data && <JsonTreeView data={data} />}
    </Panel>
  );
};
