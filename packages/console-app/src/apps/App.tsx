//
// Copyright 2021 DXOS.org
//

import { CssBaseline, ThemeProvider } from '@mui/material';
import { ThemeProviderProps } from '@mui/material/styles/ThemeProvider';
import React from 'react';
import {
  HashRouter as Router,
  Redirect,
  Route,
  Switch,
  generatePath,
  useHistory,
  useParams
} from 'react-router-dom';

import { Container, Fullscreen, Sidebar } from '../components';
import { IConfig, ConfigContext } from '../hooks';
import { IPanel } from '../types';

interface MainProps {
  panels: IPanel[];
}

/**
 * Main app container.
 */
export const Main = ({ panels }: MainProps) => {
  const history = useHistory();
  const { panel }: { panel: string } = useParams();

  const handleNavigate = (id: string) => {
    const { path } = panels.find(panel => panel.id === id)!;
    history.push(generatePath(path, {}));
  };

  return (
    <Fullscreen>
      <Container
        sidebar={
          <Sidebar
            panels={panels}
            selected={panel}
            onSelect={handleNavigate}
          />
        }
      >
        <>
          {/* TODO(burdon): Cache panels so that they are not rendered each time. */}
          {panels.map(({ path, component }) => (
            <Route
              key={path}
              path={path}
              component={component}
            />
          ))}
        </>
      </Container>
    </Fullscreen>
  );
};

interface AppProps {
  config: IConfig
  panels: IPanel[]
  theme: ThemeProviderProps['theme']
}

export const App = ({ config, panels, theme }: AppProps) => (
  <ConfigContext.Provider value={config}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Switch>
          <Route path='/:panel'>
            <Main panels={panels} />
          </Route>
          <Redirect to={panels[0].path} />
        </Switch>
      </Router>
    </ThemeProvider>
  </ConfigContext.Provider>
);
