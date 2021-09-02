//
// Copyright 2021 DXOS.org
//

import React from 'react';

import { Button, ButtonGroup } from '@material-ui/core';

import { IRecordType } from '../registry';

interface RecordTypeSelectorProperties {
  types: IRecordType[]
  type?: string
  onTypeChange: (type: string | undefined) => void
}

const allType = 'all';

export const RecordTypeSelector = ({ types, type: selectedRaw, onTypeChange }: RecordTypeSelectorProperties) => {
  const selected = selectedRaw ?? allType;
  const makeButton = ({ type, label }: IRecordType) => (
    <Button
    key={type}
    variant={type === selected ? 'contained' : 'outlined'}
    onClick={() => onTypeChange(type === allType ? undefined : type)}
      >
      {label}
    </Button>
  );

  return (
    <ButtonGroup
      disableRipple
      disableFocusRipple
      variant='outlined'
      size='small'
      aria-label='text primary button group'
    >
      {makeButton({type: 'all', label: 'All'})}
      {types.map(makeButton)}
    </ButtonGroup>
  );
};
