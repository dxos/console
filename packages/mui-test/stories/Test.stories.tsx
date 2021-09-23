//
// Copyright 2021 DXOS.org
//

import React from 'react';
import { Button, ButtonProps, createTheme, ThemeProvider } from '@mui/material';
import { Meta, Story } from '@storybook/react';

// @ts-ignore
import TestDocs from './Test.mdx';

const theme = createTheme({
  palette: {
    mode: 'dark'
  }
});

const withThemeProvider = (Story: Story, context: any) => (
  <ThemeProvider theme={theme}>
    <Story {...context} />
  </ThemeProvider>
);

export default {
  title: 'Mui/Button',
  component: Button,
  argTypes: {
    // https://storybook.js.org/docs/react/essentials/controls
    variant: {
      options: ['text', 'contained', 'outlined'],
      control: { type: 'radio' }
    },
    // https://storybook.js.org/docs/react/essentials/actions
    onClick: {
      action: 'clicked'
    }
  },
  parameters: {
    // https://storybook.js.org/docs/react/writing-docs/docs-page
    docs: {
      page: TestDocs
    }
  },
  decorators: [
    withThemeProvider
  ]
} as Meta;

const Template: Story<ButtonProps> = (args) => <Button {...args}>Test</Button>;

export const Primary = Template.bind({});
