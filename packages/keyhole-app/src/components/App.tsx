//
// Copyright 2020 DXOS.org
//

import clsx from 'clsx';
import React, { useState } from 'react';
import superagent from 'superagent';

import { makeStyles } from '@material-ui/core';

// TODO(burdon): Snowpack error: Buffer is not defined.
// import { Passcode } from '@dxos/react-ux';

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
    justifyContent: 'center',
    margin: 64
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center',
    '& > div': {
      display: 'flex',
      justifyContent: 'center',
      color: '#CCC'
    }
  },
  code: {
    display: 'flex',
    flexShrink: 0,
    justifyContent: 'center'
  },
  spin: {
    animation: '$spinner 1s linear'
  },
  '@keyframes spinner': {
    '0%': {
      transform: 'scale(1) rotate(0deg)',
      opacity: 1
    },
    '50%': {
      transform: 'scale(0.5) rotate(90deg)',
      opacity: 0.4
    },
    '100%': {
      transform: 'scale(0) rotate(180deg)',
      opacity: 0
    }
  }
}));

const App = () => {
  const classes = useStyles();
  const [spin, setSpin] = useState(false);

  // TODO(burdon): Post PIN to dx app serve (sets cookie and redirects).
  const handleSubmit = (code: string) => {
    setSpin(true);
    setTimeout(() => setSpin(false), 1000);

    // TODO(burdon): Test JSON result and redirect.
    superagent.post('/')
      .send({ code })
      .set('accept', 'json')
      .end((err: string, res: any) => {
        console.log(err, res);
      });
  };

  // TODO(burdon): Autofocus.
  return (
    <div className={clsx(classes.fullscreen, classes.root)}>
      <div className={classes.main}>
        <div>
          <Logo className={clsx(spin && classes.spin)} style={{ width: 360, height: 360 }} />
        </div>
      </div>
      <div className={classes.code}>
        <button onClick={() => handleSubmit('')}>TEST</button>
        {/*
        <Passcode
          editable={true}
          length={6}
          onSubmit={handleSubmit}
        />
        */}
      </div>
    </div>
  );
};

export default App;
