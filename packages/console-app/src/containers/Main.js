//
// Copyright 2020 DXOS.org
//

import { ApolloProvider } from '@apollo/react-hooks';
import React from 'react';
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom';

import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';

import { ErrorHandler } from '@dxos/debug';

import { clientFactory } from '../client';
import modules from '../modules';
import { createTheme } from '../theme';
import { build } from '../version.json';
import ConsoleContextProvider from './ConsoleContextProvider';
import Layout from './Layout';
import Config from './panels/Config';
import Metadata from './panels/Metadata';
import Apps from './panels/apps/Apps';
import Bots from './panels/bots/Bots';
import IPFS from './panels/ipfs/IPFS';
import Kubes from './panels/kubes/Kubes';
import Registry from './panels/registry/Registry';
import Signaling from './panels/signal/Signaling';
import System from './panels/system/System';

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
