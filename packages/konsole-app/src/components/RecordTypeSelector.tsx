//
// Copyright 2021 DXOS.org
//

import React from 'react';

import { Button, ButtonGroup } from '@material-ui/core';

import { IRecordType } from '../registry';

interface RecordTypeSelectorProperties {
  types: IRecordType[]
  type?: string
  onTypeChange: (type: string) => void
}

export const RecordTypeSelector = ({ types, type: selected, onTypeChange }: RecordTypeSelectorProperties) => {
  return (
    <ButtonGroup
      disableRipple
      disableFocusRipple
      variant='outlined'
      size='small'
      aria-label='text primary button group'
    >
      {types.map(({ type, label }) => (
        <Button
          key={type}
          variant={type === selected ? 'contained' : 'outlined'}
          onClick={() => onTypeChange(type)}
        >
          {label}
        </Button>
      ))}
    </ButtonGroup>
  );
};
