//
// Copyright 2020 DxOS.org
//

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import Snackbar from '@material-ui/core/Snackbar';

const useStyles = makeStyles(() => ({
  root: {
    marginBottom: 60
  }
}));

const Error = ({ message, ...rest }) => {
  const classes = useStyles();
  if (!message) {
    return null;
  }

  const messages = Array.isArray(message) ? message : [message];

  return (
    <Snackbar
      className={classes.root}
      open={Boolean(message)}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      TransitionProps={{ exit: false }}
    >
      <Alert severity="error" {...rest}>
        <AlertTitle>Error</AlertTitle>
        {messages.map((message, i) => (
          <div key={i}>{message}</div>
        ))}
      </Alert>
    </Snackbar>
  );
};

export default Error;
