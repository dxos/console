//
// Copyright 2021 DXOS.org
//

import { colors } from '@material-ui/core';
import { createTheme } from '@material-ui/core/styles';

import { IConfig } from './hooks';

/**
 * Create material theme.
 * https://material-ui.com/customization/theming
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
  },
});