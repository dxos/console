//
// Copyright 2020 DXOS.org
//

import React from 'react';

import { CssBaseline } from '@material-ui/core';
import { MuiThemeProvider, createTheme } from '@material-ui/core/styles';

import { useConfig } from '../hooks';

const createCustomTheme = (theme: 'light' | 'dark' | undefined) => createTheme({
  palette: {
    type: theme
  },
  props: {
    MuiAppBar: {
      elevation: 0
    },

    MuiButtonBase: {
      disableRipple: true
    }
  },
});

/**
 * Root Material UI component.
 * @param children
 * @constructor
 */
export const Root = ({ children }: { children: any }) => {
  const config = useConfig();

  return (
    <MuiThemeProvider theme={createCustomTheme(config.app.theme)}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};
