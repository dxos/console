//
// Copyright 2021 DXOS.org
//

import {
  createTheme, styled, Box, Button, ButtonProps, CssBaseline, Paper, ThemeProvider, Toolbar
} from '@mui/material';
import debug from 'debug';
import React from 'react';

import { createCustomTheme } from '../src';
import { config, RootContainer } from './config';

debug.enable('dxos:console:*');

export default {
  title: 'Theme'
};

// Reusable styled components.
// https://mui.com/customization/how-to-customize/#2-reusable-style-overrides
const StyledButton = styled(Button)<ButtonProps>(({ theme }) => ({
  '&.MuiButton-root': { // NOTE: No space after & in order to select from root (not children).
    color: theme.palette.text.secondary
  }
}));

const App = () => (
  <Paper>
    <Toolbar>
      <Button variant='contained' color='primary'>Primary</Button>
      <Box sx={{ padding: 1 }} />
      <Button variant='outlined' color='secondary'>Secondary</Button>
      <Box sx={{ padding: 1 }} />
      <StyledButton>Styled</StyledButton>
    </Toolbar>
  </Paper>
);

export const Primary = () => {
  return (
    <RootContainer config={config}>
      <App />
    </RootContainer>
  );
};

export const Test = () => {
  return (
    <ThemeProvider theme={createCustomTheme(config)}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  );
};

export const Raw = () => {
  return (
    <App />
  );
};

export const Custom = () => {
  const theme = createTheme({
    // Global overrides
    // https://mui.com/customization/theme-components/#default-props
    components: {
      MuiButtonBase: {
        defaultProps: {
          disableRipple: true
        }
      }
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  );
};
