//
// Copyright 2019 DXOS.org
//

import { useContext, useEffect } from 'react';

import { ConsoleContext } from './context';

export const STATUS = 'xxx';
export const SET_STATUS = 'set.status';

/**
 * Dispatcher for app status.
 */
export const useStatusReducer = () => {
  const { state, dispatch } = useContext(ConsoleContext);

  return [
    state[STATUS] || {},
    value => dispatch({ type: SET_STATUS, payload: value || { exceptions: [] } })
  ];
};

/**
 * Handle Apollo queries.
 */
export const useQueryStatusReducer = ({ loading, error, data, refetch }) => {
  const [, setStatus] = useStatusReducer();

  useEffect(() => {
    if (loading) {
      setStatus({ loading });
    }

    if (error) {
      setStatus({ error });
    }
  }, [loading, error]);

  return { data, refetch };
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
