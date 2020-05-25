//
// Copyright 2020 DxOS
//

import debug from 'debug';
import React from 'react';
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import config from '../../config.yml';
import { createTheme } from '../theme';
import { clientFactory } from '../client';
import modules from '../modules';

import Layout from '../components/Layout';
import ConsoleContextProvider from './ConsoleContextProvider';

import Config from './panels/Config';
import IPFS from './panels/IPFS';
import Status from './panels/Status';
import WNS from './panels/WNS';

debug.enable(config.system.debug);

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
                  <Route path="/config" component={Config} />
                  <Route path="/ipfs" component={IPFS} />
                  <Route path="/status" component={Status} />
                  <Route path="/wns" component={WNS} />
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
