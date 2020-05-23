//
// Copyright 2020 DxOS
//

import React from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import config from '../../config.json';

import { createTheme } from '../theme';
import { client } from '../client';
import modules from '../modules';

import Status from './Status';

import Layout from '../components/Layout';
import ConsoleContextProvider from './ConsoleContextProvider';

const Main = () => {
  return (
    <ApolloProvider client={client}>
      <ConsoleContextProvider modules={modules}>
        <ThemeProvider theme={createTheme(config.app.theme)}>
          <CssBaseline />
          <Layout>
            <Status />
          </Layout>
        </ThemeProvider>
      </ConsoleContextProvider>
    </ApolloProvider>
  );
};

export default Main;
