//
// Copyright 2021 DXOS.org
//

import { colors } from '@mui/material';
import { createTheme } from '@mui/material/styles';

import { IConfig } from './hooks';

/**
 * Create material theme.
 * https://mui.com/customization/theming
 * @param config
 */
export const createCustomTheme = (config: IConfig) => createTheme({
  // TODO(burdon): https://mui.com/customization/palette
  // overrides: {
  //   MuiCssBaseline: {
  //     '@global': {
  //       body: {
  //         overflow: 'hidden' // Prevent bounce.
  //       }
  //     }
  //   }
  // },

  // TODO(burdon): Include font directly: https://mui.com/customization/typography
  typography: {
    fontFamily: 'DM Sans, sans-serif',
    // fontSize: 12
  },

  palette: {
    mode: config.app.theme,
    primary: colors.cyan
  },

  // https://mui.com/customization/theme-components/#default-props
  components: {
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
});
