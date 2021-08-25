//
// Copyright 2020 DXOS.org
//

import React from 'react';

import { CssBaseline } from '@material-ui/core';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import { useConfig } from '../hooks';

const createTheme = (theme: 'light' | 'dark' | undefined) => createMuiTheme({
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
    <MuiThemeProvider theme={createTheme(config.app.theme)}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};
