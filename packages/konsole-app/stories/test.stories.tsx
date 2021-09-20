//
// Copyright 2021 DXOS.org
//

import React from 'react';

import { Box, Button, ButtonProps, CssBaseline, Paper } from '@mui/material';
import { createTheme, styled, ThemeProvider } from '@mui/material/styles';

export default {
  title: 'Test'
};

//
// Migration Tests
// https://next.material-ui.com/guides/migration-v4
// TODO(burdon): Remove @mui/styles
// TODO(burdon): Roboto/DM fonts.
//

// Reusable styled components.
// https://mui.com/customization/how-to-customize/#2-reusable-style-overrides
const StyledButton = styled(Button)<ButtonProps>(({ theme }) => ({
  '&.MuiButton-root': { // NOTE: No space after & in order to select from root (not children).
    color: theme.palette.text.primary
  }
}));

export const Test = () => {
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
      <Box
        sx={{
          height: '100vh',
          padding: theme => theme.spacing(2)
        }}
      >
        <Paper
          sx={{
            padding: theme => theme.spacing(2)
          }}
        >
          {/* https://mui.com/customization/how-to-customize/#overriding-nested-component-styles */}
          <Button
            variant='contained'
            sx={{
              '&.MuiButton-root': {
                color: theme => theme.palette.text.primary
              }
            }}
          >
            Button
          </Button>
          <StyledButton>
            StyledButton
          </StyledButton>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};
