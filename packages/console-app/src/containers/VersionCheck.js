//
// Copyright 2020 DxOS.org
//

import compareVersions from 'compare-versions';
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
  const status = useQueryStatusReducer(useQuery(SYSTEM_STATUS));
  const data = useQueryStatusReducer(useQuery(WNS_RECORDS, {
    pollInterval: CHECK_INTERVAL,
    variables: { type: 'wrn:resource' }
  }));

  // Check version.
  useEffect(() => {
    if (status && data) {
      const { dxos: { image: current } } = status.system_status;
      let latest = current;
      data.wns_records.json.forEach(({ attributes: { name, version } }) => {
        // TODO(burdon): Filter by type (WRN?)
        if (name.startsWith('dxos/xbox:')) {
          if (compareVersions(version, latest) > 0) {
            latest = version;
          }
        }
      });

      setUpgrade({ current, latest: latest !== current ? latest : undefined });
    }
  }, [status, data]);

  // TODO(burdon): Link to Github page with upgrade info.
  return (
    <>
      {current && (
        <div>SYS: {current}</div>
      )}
      {latest && (
        <div className={classes.update}>LATEST: {latest}</div>
      )}
    </>
  );
};

export default VersionCheck;
