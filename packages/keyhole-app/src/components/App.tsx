//
// Copyright 2020 DXOS.org
//

import clsx from 'clsx';
import React from 'react';

import { makeStyles } from '@material-ui/core';

import { Passcode } from '@dxos/react-ux';

import Logo from './Logo';

// TODO(burdon): Change theme (dark) and use standard palette in react-ux.
const useStyles = makeStyles(() => ({
  '@global': {
    body: {
      margin: 0,
      padding: 0,
      overflow: 'hidden',
      backgroundColor: '#222'
    }
  },
  fullscreen: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  },
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center',
    margin: 64,
    '& > div': {
      display: 'flex',
      justifyContent: 'center',
      color: '#CCC'
    }
  },
  code: {
    display: 'flex',
    flexShrink: 0,
    justifyContent: 'center',
    margin: 64
  }
}));

const App = () => {
  const classes = useStyles();

  const handleSubmit = (value: string) => {
    console.log(value);
  };

  // TODO(burdon): Autofocus.
  return (
    <div className={clsx(classes.fullscreen, classes.root)}>
      <div className={classes.main}>
        <div>
          <Logo style={{ width: 360, height: 360 }} />
        </div>
      </div>
      <div className={classes.code}>
        <Passcode
          editable={true}
          length={6}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default App;
