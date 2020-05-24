//
// Copyright 2020 DxOS
//

import React from 'react';
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import config from '../../config.json';

import { createTheme } from '../theme';
import { clientFactory } from '../client';
import modules from '../modules';

import Config from '../components/Config';
import Layout from '../components/Layout';

import ConsoleContextProvider from './ConsoleContextProvider';

import Status from './Status';

const Main = () => {
  return (
    <ApolloProvider client={clientFactory(config)}>
      <ConsoleContextProvider config={config} modules={modules}>
        <ThemeProvider theme={createTheme(config.app.theme)}>
          <CssBaseline />
          <HashRouter>
            <Switch>
              <Route path="/:module">
                <Layout>
                  <Route path="/status" component={Status} />
                  <Route path="/config" component={Config} />
                </Layout>
              </Route>
              <Redirect to="/status" />
            </Switch>
          </HashRouter>
        </ThemeProvider>
      </ConsoleContextProvider>
    </ApolloProvider>
  );
};

export default Main;
