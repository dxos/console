//
// Copyright 2020 DXOS.org
//

import React, { useEffect, useReducer } from 'react';
import defaultsDeep from 'lodash.defaultsdeep';

import ErrorBoundary from '../components/ErrorBoundary';

import { ConsoleContext, statusReducer, STATUS, SET_STATUS } from '../hooks';

const defaultState = {};

/**
 * Actions reducer.
 * https://reactjs.org/docs/hooks-reference.html#usereducer
 * @param {Object} state
 * @param {string} action
 */
const appReducer = (state, action) => ({
  [STATUS]: statusReducer(state[STATUS], action)
});

/**
 * Creates the Console framework context, which provides the global UX state.
 * Wraps children with a React ErrorBoundary component, which catches runtime errors and enables reset.
 *
 * @param {function} children
 * @param {Object} config
 * @param {Object} modules
 * @param {Object} [initialState]
 * @param {function} [errorHandler]
 * @returns {function}
 */
const ConsoleContextProvider = ({ children, config, modules, initialState = {}, errorHandler }) => {
  const [state, dispatch] = useReducer(appReducer, defaultsDeep({}, initialState, defaultState));

  // Bind the error handler.
  if (errorHandler) {
    useEffect(() => {
      errorHandler.on('error', error => {
        dispatch({
          type: SET_STATUS,
          payload: {
            error
          }
        });
      });
    }, []);
  }

  return (
    <ConsoleContext.Provider value={{ config, modules, state, dispatch }}>
      <ErrorBoundary>
        {children}
      </ErrorBoundary>
    </ConsoleContext.Provider>
  );
};

export default ConsoleContextProvider;
