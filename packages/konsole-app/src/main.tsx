//
// Copyright 2020 DXOS.org
//

import React from 'react';
import ReactDOM from 'react-dom';
import {
  HashRouter as Router,
  Redirect,
  Route,
  Switch,
  useHistory,
  useParams
} from 'react-router-dom';

import { Container, IPanel, Root, Sidebar } from './containers';
import { ConfigContext, IConfig, RegistryContext } from './hooks';
import { ConfigPanel, RecordPanel } from './panels';
import { MockRegistryClient } from './testing';
import { Config } from '../stories/panels.stories';

// TODO(burdon): Load from environment.
const config: IConfig = {
  app: {
    name: 'Konsole',
    theme: 'dark'
  }
};

const panels: IPanel[] = [
  {
    path: '/config',
    label: 'Config',
    component: ConfigPanel
  },
  {
    path: '/records',
    label: 'Records',
    component: RecordPanel
  }
];

const App = () => {
  const history = useHistory();
  const { panel }: { panel: string } = useParams();

  return (
    <Root>
      <Container
        sidebar={
          <Sidebar
            panels={panels}
            selected={`/${panel}`}
            onSelect={path => history.push(path)}
          />
        }
      >
        <>
          {panels.map(({ path, component }) => (
            <Route
              key={path}
              path={path}
              component={component}
            />
          ))}
        </>
      </Container>
    </Root>
  )
};

const start = (config: IConfig) => {
  ReactDOM.render((
    <ConfigContext.Provider value={config}>
      <RegistryContext.Provider value={new MockRegistryClient()}>
        <Router>
          <Switch>
            <Route path='/:panel'>
              <App />
            </Route>
            <Redirect to={panels[0].path} />
          </Switch>
        </Router>
      </RegistryContext.Provider>
    </ConfigContext.Provider>
  ), document.getElementById('root'));
};

start(config);
