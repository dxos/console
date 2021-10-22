//
// Copyright 2021 DXOS.org
//

import { colors } from '@mui/material';
import { createTheme } from '@mui/material/styles';

import { IConfig } from './hooks';

/**
 * Create material theme.
 * https://mui.com/customization/theming
 */
export const createCustomTheme = (config: IConfig) => createTheme({

  // https://mui.com/customization/palette
  palette: {
    mode: config.app.theme,
    primary: colors.cyan,
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
      defaultProps: {
        elevation: 0
      }
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true
      }
    },
    MuiPaper: {
      defaultProps: {
        elevation: 1
        // variant: 'outlined'
      }
    }
  }
});
