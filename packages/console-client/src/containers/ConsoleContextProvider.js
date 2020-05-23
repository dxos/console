//
// Copyright 2020 Wireline, Inc.
//

import React, { useEffect, useReducer } from 'react';
import defaultsDeep from 'lodash.defaultsdeep';

import ErrorBoundary from '../components/ErrorBoundary';

import { ConsoleContext, statusReducer, SET_STATUS } from '../hooks';

const defaultState = {};

/**
 * Actions reducer.
 * https://reactjs.org/docs/hooks-reference.html#usereducer
 * @param {Object} state
 * @param {string} action
 */
const appReducer = (state, action) => ({
  // TODO(burdon): Key shouldn't be same as action type.
  [SET_STATUS]: statusReducer(state[SET_STATUS], action)
});

/**
 * Creates the Console framework context, which provides the global UX state.
 * Wraps children with a React ErrorBoundary component, which catches runtime errors and enables reset.
 *
 * @param {function} children
 * @param {function} modules
 * @param {Object} [initialState]
 * @param {function} [errorHandler]
 * @returns {function}
 */
const ConsoleContextProvider = ({ children, modules, initialState = {}, errorHandler }) => {
  const [state, dispatch] = useReducer(appReducer, defaultsDeep({}, initialState, defaultState));

  const { errors: { exceptions = [] } = {} } = state[SET_STATUS] || {};

  // Bind the error handler.
  if (errorHandler) {
    useEffect(() => {
      errorHandler.on('error', error => {
        dispatch({
          type: SET_STATUS,
          payload: {
            exceptions: [error, ...exceptions]
          }
        });
      });
    }, []);
  }

  return (
    <ConsoleContext.Provider value={{ modules, state, dispatch }}>
      <ErrorBoundary>
        {children}
      </ErrorBoundary>
    </ConsoleContext.Provider>
  );
};

export default ConsoleContextProvider;
