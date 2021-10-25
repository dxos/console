//
// Copyright 2020 DXOS.org
//

import { keyframes } from '@emotion/react';
import { colors, Box, CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import superagent from 'superagent';

import { Kube } from '@dxos/gem-experimental';
import { Passcode } from '@dxos/react-components';

import { useContentScript } from '../hooks';

const APP_AUTH_PATH = '/app/auth';
const WALLET_AUTH_PATH = '/wallet/auth';

const theme = createTheme({
  palette: {
    action: {
      selected: colors.grey[200],
      hover: '#121212'
    },
    divider: colors.grey[400],
    background: {
      default: '#000'
    },
    text: {
      primary: colors.grey[50],
      disabled: colors.grey[100]
    }
  },
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

const shake = keyframes`
  10%, 90% {
    transform: translate3d(-8px, 0, 0);
  }
  
  20%, 80% {
    transform: translate3d(8px, 0, 0);
  }

  30%, 50%, 70% {
    transform: translate3d(-8px, 0, 0);
  }

  40%, 60% {
    transform: translate3d(8px, 0, 0);
  }
`;

const drop = keyframes`
  0% {
    transform: translate3d(0, 0, 0);
  }

  100% {
    transform: translate3d(0, 500px, 0);
  }
`;

const phrases = [
  'enter passcode',
  '输入密码',
  'введите пароль',
  'パスワードを入力する',
  'wprowadź hasło',
  'أدخل كلمة المرور',
  'introducir la contraseña'
];

enum State {
  Default = 0,
  Success,
  Error,
}

export const App = () => {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState(State.Default);
  const [phrase, setPhrase] = useState(phrases[0]);
  const { rpcClient: contentScript } = useContentScript();
  const rpcClient = contentScript?.rpc;

  const onLogin = () => {
    setState(State.Success);
    const redirect = decodeURIComponent(window.location.hash?.replace('#', ''));
    if (redirect) {
      window.location.href = redirect;
    }
  };

  useEffect(() => {
    const t = setInterval(() => {
      setPhrase(phrases[Math.floor(phrases.length * Math.random())]);
    }, 5000);

    return () => clearInterval(t);
  }, []);

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
            console.log('Couldn\'t login with wallet identity. Falling back to OTP.');
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
            setState(State.Error);
            setAttempt(attempt + 1);
            setTimeout(() => setState(State.Default), 1000);
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
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          overflow: 'hidden'
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
              minDistance: 120,
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
            height: 180,
            animation: state === State.Success ? `${drop} 0.5s ease-in` : undefined
          }}
        >
          <Box
            sx={{
              animation: state === State.Error ? `${shake} 0.6s linear` : undefined
            }}
          >
            <Passcode
              editable={true}
              length={6}
              attempt={attempt}
              onSubmit={handleSubmit}
            />
          </Box>
          <Box
            sx={{
              marginTop: 1,
              fontSize: 22,
              fontWeight: 50,
              color: colors.grey[600]
            }}
          >
            {phrase}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};
