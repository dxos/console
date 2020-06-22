//
// Copyright 2020 DxOS.org
//

import compareVersions from 'compare-versions';
import get from 'lodash.get';
import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { makeStyles } from '@material-ui/core';

import SYSTEM_STATUS from '../gql/system_status.graphql';
import WNS_RECORDS from '../gql/wns_records.graphql';

import { useQueryStatusReducer } from '../hooks';

const CHECK_INTERVAL = 5 * 60 * 1000;

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
  const statusResponse = useQueryStatusReducer(useQuery(SYSTEM_STATUS));
  const wnsResponse = useQueryStatusReducer(useQuery(WNS_RECORDS, {
    pollInterval: CHECK_INTERVAL,
    variables: { attributes: { type: 'wrn:resource' } }
  }));

  // Check version.
  useEffect(() => {
    if (statusResponse && wnsResponse) {
      const statusData = JSON.parse(statusResponse.system_status.json);
      const wnsData = JSON.parse(wnsResponse.wns_records.json);

      const current = get(statusData, 'dxos.kube.version', '0.0.0');

      let latest = current;
      wnsData.forEach(({ attributes: { name, version } }) => {
        // TODO(burdon): Filter by type (WRN?)
        if (name.startsWith('dxos/kube:')) {
          if (compareVersions(version, latest) > 0) {
            latest = version;
          }
        }
      });

      setUpgrade({ current, latest: latest !== current ? latest : undefined });
    }
  }, [statusResponse, wnsResponse]);

  // TODO(burdon): Link to Github page with upgrade info.
  return (
    <>
      {current && (
        <div>SYS: {current}</div>
      )}
      {latest && (
        <div className={classes.update}>(LATEST: {latest})</div>
      )}
    </>
  );
};

export default VersionCheck;
