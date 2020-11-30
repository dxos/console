//
// Copyright 2020 DXOS.org
//

import React from 'react';
import StopIcon from '@material-ui/icons/HighlightOff';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  off: {
    color: theme.palette.error.main
  }
}));

const BotControls = ({ onStop }) => {
  const classes = useStyles();
  return (
    <div>
      {/* onStop */ true && (
        <IconButton onClick={onStop} title='Stop'>
          <StopIcon className={classes.off} />
        </IconButton>
      )}
    </div>
  );
};

export default BotControls;
