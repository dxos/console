//
// Copyright 2020 DxOS
//

import React, { useEffect, useState } from 'react';

import { useStatusReducer } from '../hooks';

// TODO(burdon): Factor out LoadingIndicator.
const Layout = ({ children }) => {
  const [{ loading, error = '' }] = useStatusReducer();
  const [isLoading, setLoading] = useState(loading);

  useEffect(() => {
    let t;
    if (loading) {
      setLoading(loading);
      t = setTimeout(() => {
        setLoading(false);
      }, 1000);
    }

    return () => clearTimeout(t);
  }, [loading]);

  return (
    <div>
      <div>
        {children}
      </div>

      <div>
        {error && (
          <span>{String(error)}</span>
        )}
        {isLoading && (
          <span>Loading</span>
        )}
      </div>
    </div>
  );
};

export default Layout;
