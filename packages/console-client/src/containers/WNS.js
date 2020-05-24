//
// Copyright 2020 DxOS
//

import React, { useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { makeStyles } from '@material-ui/core';

import Json from '../components/Json';

import { ConsoleContext, useQueryStatusReducer } from '../hooks';

import QUERY from '../../gql/wns.graphql';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflowY: 'scroll'
  }
}));

const WNS = () => {
  const classes = useStyles();
  const { config } = useContext(ConsoleContext);
  const data = useQueryStatusReducer(useQuery(QUERY, { pollInterval: config.api.pollInterval }));
  if (!data) {
    return null;
  }

  // TODO(burdon): peers causes issues.
  // Warning: Failed prop type: Invalid prop `children` supplied to `ForwardRef(Typography)`, expected a ReactNode.
  const d = JSON.parse(data.wns.json);
  d.peers = [];

  // TODO(burdon): Return structured GraphQL.
  return (
    <div className={classes.root}>
      <Json data={{ wns: d }} />
    </div>
  );
};

export default WNS;
