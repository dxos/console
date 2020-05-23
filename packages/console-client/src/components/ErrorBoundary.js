//
// Copyright 2020 DxOS
//

import React, { Component } from 'react';

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
        <pre>{String(error)}</pre>
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
