//
// Copyright 2020 DXOS.org
//

import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';

/**
 * Root-level error boundary.
 * https://reactjs.org/docs/error-boundaries.html
 *
 * NOTE: Must currently be a Component.
 * https://reactjs.org/docs/hooks-faq.html#do-hooks-cover-all-use-cases-for-classes
 */
class ErrorBoundary extends Component {
  static getDerivedStateFromError (error) {
    return { error };
  }

  state = {
    error: null
  };

  componentDidCatch (error, errorInfo) {
    const { onError } = this.props;

    // TODO(burdon): Show error indicator.
    // TODO(burdon): Logging service; output error file.
    onError(error);
  }

  render () {
    const { children } = this.props;
    const { error } = this.state;

    if (error) {
      return (
        <div>
          <Typography>Error</Typography>
          <pre>{String(error)}</pre>
        </div>
      );
    }

    return (
      <div>
        {children}
      </div>
    );
  }
}

ErrorBoundary.defaultProps = {
  onError: console.warn
};

export default ErrorBoundary;
