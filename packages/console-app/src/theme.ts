//
// Copyright 2021 DXOS.org
//

import { colors, createTheme } from '@mui/material';

import { ConfigV1Object } from '@dxos/config';

type ThemeMode = 'light' | 'dark' | undefined;

/**
 * Create material theme.
 * https://mui.com/customization/theming
 */
export const createCustomTheme = (config: ConfigV1Object) => createTheme({

  // https://mui.com/customization/palette
  palette: {
    mode: config.runtime?.app?.theme as ThemeMode,
    primary: colors.teal,
    secondary: colors.orange
  },

  // TODO(burdon): Include font directly: https://mui.com/customization/typography
  typography: {
    fontFamily: 'DM Sans, sans-serif'
  },

  // https://mui.com/customization/theme-components/#default-props
  components: {

    // https://mui.com/components/css-baseline
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          overflow: 'hidden' // Prevent scroll bounce.
        },
        pre: {
          margin: 0,
          padding: 8,
          fontFamily: 'DM Mono, monospace'
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          elevation: 0
        }
      }
    },
    MuiButtonBase: {
      styleOverrides: {
        root: {
          disableRipple: true
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          elevation: 1
          // variant: 'outlined'
        }
      }
    }
  }
});
