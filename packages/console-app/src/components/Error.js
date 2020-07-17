//
// Copyright 2020 DXOS.org
//

import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import Snackbar from '@material-ui/core/Snackbar';

const useStyles = makeStyles(() => ({
  root: {
    marginBottom: 48
  },

  alert: {
    minWidth: 400
  }
}));

const Error = ({ error, ...rest }) => {
  const classes = useStyles();
  const [message, setMessage] = useState(error);

  useEffect(() => {
    setMessage(error ? error.message || String(error) : null);
  }, [error]);

  const handleClose = () => {
    setMessage(null);
  };

  return (
    <Snackbar
      classes={{ root: classes.root }}
      open={Boolean(message)}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      TransitionProps={{ exit: false }}
      autoHideDuration={1000}
    >
      <Alert classes={{ root: classes.alert }} severity='error' {...rest} onClose={handleClose}>
        <AlertTitle>Error</AlertTitle>
        <div>{message}</div>
      </Alert>
    </Snackbar>
  );
};

export default Error;
