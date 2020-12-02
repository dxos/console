//
// Copyright 2020 DXOS.org
//

import React, { useState } from 'react';
import StopIcon from '@material-ui/icons/HighlightOff';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  stop: {
    color: theme.palette.error.main
  }
}));

const BotControls = ({ onStop }) => {
  const [stopPressed, setStopPressed] = useState(false);
  const classes = useStyles();

  const stopBot = () => {
    if (!stopPressed) {
      setStopPressed(true);
      onStop();
    }
  };

  return (
    <div>
      {onStop && (
        <IconButton onClick={stopBot} title='Stop'>
          {!stopPressed && (<StopIcon className={classes.stop} />)}
          {stopPressed && (<CircularProgress className={classes.stop} size={24} />)}
        </IconButton>
      )}
    </div>
  );
};

export default BotControls;
