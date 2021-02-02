//
// Copyright 2020 DXOS.org
//

import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import StopIcon from '@material-ui/icons/HighlightOff';
import OpenIcon from '@material-ui/icons/OpenInBrowser';
import StartIcon from '@material-ui/icons/PlayCircleOutline';

const ControlButtons = ({ onStart, onStop, onOpen }) => {
  return (
    <div>
      {onStart && (
        <IconButton onClick={onStart} title='Restart'>
          <StartIcon />
        </IconButton>
      )}

      {onStop && (
        <IconButton onClick={onStop} title='Stop'>
          <StopIcon />
        </IconButton>
      )}

      {onOpen && (
        <IconButton onClick={onOpen} title='Open console'>
          <OpenIcon />
        </IconButton>
      )}
    </div>
  );
};

export default ControlButtons;
