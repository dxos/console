//
// Copyright 2020 DXOS.org
//

import clsx from 'clsx';
import React, { useState } from 'react';
import superagent from 'superagent';

import { makeStyles } from '@material-ui/core';

import gem from '@dxos/gem-experimental';
import { Passcode } from '@dxos/react-ux';

const APP_AUTH_PATH = '/app/auth';

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
    marginTop: 80,
    marginBottom: 80
  },
  main: {
    position: 'relative',
    overflow: 'hidden',
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
    justifyContent: 'center',
    // TODO(burdon): Update react-ux.
    '& input': {
      position: 'absolute',
      left: -1000
    },
    '& div': {
      borderRadius: 8
    }
  },
  error: {
    '& div': {
      borderColor: 'IndianRed'
    }
  },
  success: {
    '& div': {
      visibility: 'hidden'
    }
  }
}));

const App = () => {
  const classes = useStyles();
  const [className, setClassname] = useState('');
  const [attempt, setAttempt] = useState(0);

  const handleSubmit = (code: string) => {
    setTimeout(() => {
      superagent.post(APP_AUTH_PATH)
        .send({ code })
        .set('accept', 'json')
        .end((err: string, res: any = {}) => {
          if (err || !res.ok) {
            setClassname(classes.error);
            setTimeout(() => setClassname(''), 1000);
            setAttempt(attempt + 1);
          } else {
            setClassname(classes.success);
            const redirect = decodeURIComponent(window.location.hash?.replace('#', ''));
            if (redirect) {
              window.location.href = redirect;
            }
          }
        });
    }, 500);
  };

  return (
    <div className={clsx(classes.fullscreen, classes.root)}>
      <div className={classes.main}>
        <gem.Kube config={{
          minDistance: 100,
          particleCount: 400
        }}
        />
      </div>
      <div className={clsx(classes.code, className)}>
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
/*

*/