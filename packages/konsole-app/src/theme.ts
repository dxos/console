//
// Copyright 2021 DXOS.org
//

import { colors } from '@mui/material';
import { createTheme } from '@mui/styles';

import { IConfig } from './hooks';

/**
 * Create material theme.
 * https://mui.com/customization/theming
 * @param config
 */
export const createCustomTheme = (config: IConfig) => createTheme({
  overrides: {
    MuiCssBaseline: {
      '@global': {
        body: {
          overflow: 'hidden' // Prevent bounce.
        }
      }
    }
  },

  // TODO(burdon): Include font directly: https://mui.com/customization/typography
  typography: {
    fontFamily: 'DM Sans, sans-serif',
    // fontSize: 12
  },

  palette: {
    type: config.app.theme,
    primary: colors.cyan
  },

  props: {
    MuiAppBar: {
      elevation: 0
    },
    MuiButtonBase: {
      disableRipple: true
    }
  }
});
