//
// Copyright 2020 DXOS.org
//

import clsx from 'clsx';
import React from 'react';

import { makeStyles, Button, ButtonGroup } from '@material-ui/core';

import { IRecordType } from '../hooks';

interface RecordTypeSelectorProperties {
  types: IRecordType[]
  type: string
  onTypeChange: (type: string) => void
}

const useStyles = makeStyles(theme => ({
  selected: {
    color: theme.palette.text.primary
  }
}));

export const RecordTypeSelector = ({ types, type: selected, onTypeChange }: RecordTypeSelectorProperties) => {
  const classes = useStyles();

  return (
    <ButtonGroup
      disableRipple
      disableFocusRipple
      variant='outlined'
      color='primary'
      size='small'
      aria-label='text primary button group'
    >
      {types.map(({ type, label }) => (
        <Button
          key={type}
          className={clsx({ [classes.selected]: type === selected })}
          onClick={() => onTypeChange(type)}
        >
          {label}
        </Button>
      ))}
    </ButtonGroup>
  );
};
