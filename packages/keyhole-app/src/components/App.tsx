//
// Copyright 2020 DXOS.org
//

import clsx from 'clsx';
import React, { useState } from 'react';
import superagent from 'superagent';

import { makeStyles } from '@material-ui/core';

import { Kube } from '@dxos/gem-experimental';
import { Passcode } from '@dxos/react-ux';

import Logo from './Logo';

// TODO(burdon): Change theme (dark) and use standard palette in react-ux.
const useStyles = makeStyles(() => ({
  '@global': {
    body: {
      margin: 0,
      padding: 0,
      overflow: 'hidden',
      backgroundColor: '#000'
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
    margin: 80
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
    animation: '$spinner .5s linear'
  },
  vannish: {
    animation: '$vannish .5s linear',
    opacity: 0
  },
  '@keyframes spinner': {
    '0%': {
      transform: 'scale(1)'
    },
    '50%': {
      transform: 'scale(0.75)',
      color: 'red'
    },
    '100%': {
      transform: 'scale(1)'
    }
  },
  '@keyframes vannish': {
    '0%': {
      transform: 'scale(1)',
      opacity: 1
    },
    '100%': {
      transform: 'scale(2)',
      opacity: 0
    }
  }
}));

const App = ({ kube = false }) => {
  const classes = useStyles();
  const [className, setClassname] = useState('');
  const [attempt, setAttempt] = useState(0);

  // TODO(burdon): Post PIN to dx app serve (sets cookie and redirects).
  const handleSubmit = (code: string) => {
    superagent.post('/') // TODO(burdon): Const.
      .send({ code })
      .set('accept', 'json')
      .end((err: string, res: any = {}) => {
        const { success } = res;
        if (err || !success) {
          setClassname(classes.spin);
          setTimeout(() => setClassname(''), 1000);
          setAttempt(attempt + 1);
        } else {
          setClassname(classes.vannish);
          // TODO(burdon): Redirect to app.
        }
      });
  };

  // TODO(burdon): Autofocus.
  return (
    <div className={clsx(classes.fullscreen, classes.root)}>
      <div className={classes.main}>
        {!kube && (
          <div>
            <Logo className={className} style={{ width: 360, height: 360 }} />
          </div>
        )}
        {kube && (
          <div>
            <Kube config={{
              minDistance: 100,
              particleCount: 400
            }}
            />
          </div>
        )}
      </div>
      <div className={classes.code}>
        <Passcode
          editable={true}
          length={6}
          attempt={attempt}
          onSubmit={handleSubmit}
          onChange={() => {}}
        />
      </div>
    </div>
  );
};

export default App;
