//
// Copyright 2020 DxOS
//

import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';
import React from 'react';
import { render } from 'react-dom';

import App from './components/App';

const PORT = 4000;

const client = new ApolloClient({
  uri: `http://localhost:${PORT}/graphql`
});

// TODO(burdon): Error handling for server errors.

// TODO(burdon): Auth
// https://www.apollographql.com/docs/react/networking/authentication/

const Main = () => {
  return (
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  );
};

render(<Main />, document.getElementById('root'));
