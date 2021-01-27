//
// Copyright 2020 DXOS.org
//

import compareVersions from 'compare-versions';
import get from 'lodash.get';
import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { makeStyles } from '@material-ui/core';
import Link from '@material-ui/core/Link';

import SYSTEM_STATUS from '../gql/system_status.graphql';
import REGISTRY_RECORDS from '../gql/registry_records.graphql';

import { useQueryStatusReducer } from '../hooks';

const CHECK_INTERVAL = 5 * 60 * 1000;

const UPDATE_LINK = 'https://github.com/dxos/kube#updating-the-system';

const useStyles = makeStyles(theme => ({
  update: {
    color: theme.palette.error.light
  }
}));

/**
 * Checks for a system upgrade.
 */
const VersionCheck = () => {
  const classes = useStyles();
  const [{ current, latest }, setUpgrade] = useState({});
  const { data: statusResponse } = useQueryStatusReducer(useQuery(SYSTEM_STATUS));
  const { data: registryResponse } = useQueryStatusReducer(useQuery(REGISTRY_RECORDS, {
    pollInterval: CHECK_INTERVAL,
    variables: { attributes: { type: 'dxn:resource' } }
  }));

  // Check version.
  useEffect(() => {
    if (statusResponse && registryResponse) {
      const statusData = JSON.parse(statusResponse.system_status.json);
      const registryData = JSON.parse(registryResponse.registry_records.json);

      const current = get(statusData, 'dxos.kube.version', '0.0.0');

      let latest = current;
      registryData.forEach(({ attributes: { name, version } }) => {
        // TODO(burdon): Filter by type (DXN?)
        if (name.startsWith('dxos/kube:')) {
          if (compareVersions(version, latest) > 0) {
            latest = version;
          }
        }
      });

      setUpgrade({ current, latest: latest !== current ? latest : undefined });
    }
  }, [statusResponse, registryResponse]);

  // TODO(burdon): Link to Github page with upgrade info.
  return (
    <>
      {current && (
        <div>System {current}</div>
      )}

      {latest && (
        <div className={classes.update}>
          (<Link href={UPDATE_LINK} target='github' title='Updating your KUBE'>LATEST: {latest}</Link>)
        </div>
      )}
    </>
  );
};

export default VersionCheck;
