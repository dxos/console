//
// Copyright 2020 DXOS.org
//

import React from 'react';
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import { ErrorHandler } from '@dxos/debug';

import { build } from '../version.json';

import { clientFactory } from '../client';
import { createTheme } from '../theme';
import modules from '../modules';

import Layout from './Layout';
import ConsoleContextProvider from './ConsoleContextProvider';

import Apps from './panels/apps/Apps';
import Bots from './panels/bots/Bots';
import Kubes from './panels/kubes/Kubes';
import Config from './panels/Config';
import IPFS from './panels/ipfs/IPFS';
import Metadata from './panels/Metadata';
import Signaling from './panels/signal/Signaling';
import System from './panels/system/System';
import Registry from './panels/registry/Registry';
import Sentry from './panels/sentry/Sentry';

// Global error handler.
const errorHandler = new ErrorHandler();

/**
 * Root application.
 */
const Main = ({ config }) => {
  Object.assign(config, { build });

  return (
    <ApolloProvider client={clientFactory(config)}>
      <ConsoleContextProvider config={config} modules={modules} errorHandler={errorHandler}>
        <ThemeProvider theme={createTheme(config.app.theme)}>
          <CssBaseline />
          <HashRouter>
            <Switch>
              <Route path='/:module'>
                <Layout>
                  <Route path='/kubes' component={Kubes} />
                  <Route path='/apps' component={Apps} />
                  <Route path='/bots' component={Bots} />
                  <Route path='/config' component={Config} />
                  <Route path='/registry' component={Registry} />
                  <Route path='/ipfs' component={IPFS} />
                  <Route path='/metadata' component={Metadata} />
                  <Route path='/signaling' component={Signaling} />
                  <Route path='/system' component={System} />
                  <Route path='/sentry' component={Sentry} />
                </Layout>
              </Route>
              <Redirect to='/system' />
            </Switch>
          </HashRouter>
        </ThemeProvider>
      </ConsoleContextProvider>
    </ApolloProvider>
  );
};

export default Main;
