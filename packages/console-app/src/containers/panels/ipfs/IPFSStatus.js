//
// Copyright 2020 DXOS.org
//

import React from 'react';

import { useQuery } from '@apollo/react-hooks';

import IPFS_STATUS from '../../../gql/ipfs_status.graphql';
import WNS_RECORDS from '../../../gql/wns_records.graphql';

import { useQueryStatusReducer } from '../../../hooks';

import Json from '../../../components/Json';

const RECORD_TYPE = 'wrn:service';
const SERVICE_TYPE = 'ipfs';

const IPFSStatus = () => {
  const { data: ipfsResponse } = useQueryStatusReducer(useQuery(IPFS_STATUS));
  const { data: wnsResponse } = useQueryStatusReducer(useQuery(WNS_RECORDS, {
    variables: { attributes: { type: RECORD_TYPE, service: SERVICE_TYPE } }
  }));

  if (!wnsResponse || !ipfsResponse) {
    return null;
  }

  const ipfsData = JSON.parse(ipfsResponse.ipfs_status.json);
  const data = {
    id: ipfsData.id.id,
    version: ipfsData.id.agentVersion,
    addresses: ipfsData.id.addresses,
    swarm: {
      peers: ipfsData.swarm.peers.length
    },
    repo: {
      numObjects: ipfsData.repo.stats.numObjects,
      repoSize: ipfsData.repo.stats.repoSize
    }
  };

  return (
    <Json data={data} />
  );
};

export default IPFSStatus;
