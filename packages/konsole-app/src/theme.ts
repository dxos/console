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
  palette: {
    mode: 'dark' // TODO(burdon): Doesn't change background.
  }

  // https://mui.com/customization/palette
  /*
  palette: {
    mode: config.app.theme,
    primary: colors.red,
    secondary: colors.pink
  },

  // TODO(burdon): Include font directly: https://mui.com/customization/typography
  typography: {
    fontFamily: 'DM Sans, sans-serif',
    // fontSize: 12
  },

  // https://mui.com/customization/theme-components/#default-props
  components: {
    // https://mui.com/components/css-baseline
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          overflow: 'hidden' // Prevent scroll bounce.
        }
      },
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
    }
  }
  */
});
