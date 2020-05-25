//
// Copyright 2019 DxOS
//

import { useContext } from 'react';

import { ConsoleContext } from './context';

export const SET_STATUS = 'errors';

/**
 *
 */
export const useStatusReducer = () => {
  const { state, dispatch } = useContext(ConsoleContext);

  return [
    state[SET_STATUS] || {},
    value => dispatch({ type: SET_STATUS, payload: value || { exceptions: [] } })
  ];
};

/**
 * Handle Apollo queries.
 */
export const useQueryStatusReducer = ({ loading, error, data }) => {
  const [, setStatus] = useStatusReducer();

  if (loading) {
    setTimeout(() => setStatus({ loading }));
  }

  if (error) {
    setTimeout(() => setStatus({ error }));
  }

  return data;
};

export const statusReducer = (state, action) => {
  switch (action.type) {
    case SET_STATUS:
      return {
        ...state,
        ...action.payload
      };

    default:
      return state;
  }
};
