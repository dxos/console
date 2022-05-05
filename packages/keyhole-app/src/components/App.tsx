//
// Copyright 2020 DXOS.org
//

import { keyframes } from '@emotion/react';
import React, { useEffect, useState } from 'react';
import superagent from 'superagent';

import { colors, Box, CssBaseline, createTheme, ThemeProvider } from '@mui/material';

import { Passcode } from '@dxos/react-components';

import { Kube } from './Kube';

const APP_AUTH_PATH = '/app/auth';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: colors.teal,
    divider: colors.grey[600]
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
  const [attempt, setAttempt] = useState(1);
  const [state, setState] = useState(State.Default);
  const [phrase, setPhrase] = useState(phrases[0]);

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
          <Box>
            <Passcode
              shake
              length={6}
              size='large'
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
