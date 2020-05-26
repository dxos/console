//
// Copyright 2020 DxOS.org
//

import debug from 'debug';
import React from 'react';
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import config from '../../config.yml';
import { build } from '../../version.json';

import { createTheme } from '../theme';
import { clientFactory } from '../client';
import modules from '../modules';

import Layout from './Layout';
import ConsoleContextProvider from './ConsoleContextProvider';

import AppRecords from './panels/apps/Apps';
import Bots from './panels/bots/Bots';
import Config from './panels/Config';
import IPFS from './panels/ipfs/IPFS';
import Metadata from './panels/Metadata';
import Signaling from './panels/Signaling';
import Status from './panels/Status';
import WNS from './panels/wns/WNS';

// TODO(burdon): Config object.
Object.assign(config, { build });

debug.enable(config.system.debug);

/**
 * Root application.
 */
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
                  <Route path="/apps" component={AppRecords} />
                  <Route path="/bots" component={Bots} />
                  <Route path="/config" component={Config} />
                  <Route path="/ipfs" component={IPFS} />
                  <Route path="/metadata" component={Metadata} />
                  <Route path="/signaling" component={Signaling} />
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
