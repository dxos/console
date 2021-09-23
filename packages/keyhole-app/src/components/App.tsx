//
// Copyright 2020 DXOS.org
//

import React, { useEffect, useState } from 'react';
import superagent from 'superagent';

import { colors, Box, CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { Kube } from '@dxos/gem-experimental';

import { useContentScript } from '../hooks';
import { Passcode } from './Passcode';

const APP_AUTH_PATH = '/app/auth';
const WALLET_AUTH_PATH = '/wallet/auth';


const theme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          overflow: 'hidden', // Prevent scroll bounce.
          background: '#000'
        }
      }
    }
  }
});

export const App = () => {
  const [attempt, setAttempt] = useState(0);
  const { rpcClient: contentScript } = useContentScript();
  const rpcClient = contentScript?.rpc;

  const onLogin = () => {
    // setClassname(classes.success);
    const redirect = decodeURIComponent(window.location.hash?.replace('#', ''));
    if (redirect) {
      window.location.href = redirect;
    }
  };

  useEffect(() => {
    if (rpcClient === undefined) {
      return;
    }

    setImmediate(async () => {
      const profile = await rpcClient.GetProfile({});
      superagent.post(WALLET_AUTH_PATH)
        .send({ key: profile.publicKey })
        .set('accept', 'json')
        .end((err: string, res: any = {}) => {
          if (err || !res.ok) {
            console.log('Couldn\'t login with wallet identity. Falling back to TOTP');
          } else {
            onLogin();
          }
        });
    });
  }, [rpcClient]);

  const handleSubmit = (code: string) => {
    setTimeout(() => {
      superagent.post(APP_AUTH_PATH)
        .send({ code })
        .set('accept', 'json')
        .end((err: string, res: any = {}) => {
          if (err || !res.ok) {
            // setClassname(classes.error);
            // setTimeout(() => setClassname(''), 1000);
            setAttempt(attempt + 1);
          } else {
            onLogin();
          }
        });
    }, 500);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh'
        }}
      >
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            flex: 1,
            overflow: 'hidden'
          }}
        >
          <Kube
            config={{
              minDistance: 100,
              particleCount: 400
            }}
          />
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 0,
            justifyContent: 'top',
            alignItems: 'center',
            height: 250
          }}
        >
          <Passcode
            editable={true}
            length={6}
            attempt={attempt}
            onSubmit={handleSubmit}
          />
          <Box
            sx={{
              marginTop: 1,
              fontSize: 24,
              fontWeight: 100,
              color: colors.grey[600]
            }}
          >
            Enter Passcode
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};
