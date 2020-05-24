//
// Copyright 2020 DxOS
//

import React, { useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Mutation } from '@apollo/react-components';
import { makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';

import Json from '../components/Json';

import { ConsoleContext, useQueryStatusReducer } from '../hooks';

import WNS_STATUS from '../../gql/wns_status.graphql';
import WNS_ACTION from '../../gql/wns_action.graphql';

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
  const data = useQueryStatusReducer(useQuery(WNS_STATUS, { pollInterval: config.api.pollInterval }));
  if (!data) {
    return null;
  }

  return (
    <div className={classes.root}>
      <Mutation mutation={WNS_ACTION}>
        {(action, { data }) => (
          <div>
            <Button
              onClick={() => {
                action({ variables: { command: 'test' } });
              }}
            >
              Test
            </Button>

            <pre>Result: {JSON.stringify(data)}</pre>
          </div>
        )}
      </Mutation>

      <Json data={JSON.parse(data.wns_status.json)} />
    </div>
  );
};

export default WNS;
