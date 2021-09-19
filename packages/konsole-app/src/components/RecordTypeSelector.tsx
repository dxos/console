//
// Copyright 2021 DXOS.org
//

import React from 'react';

import { Button, ButtonGroup } from '@mui/material';

import { CID } from '@dxos/registry-api';

import { IRecordType } from '../panels';

interface RecordTypeSelectorProperties {
  types: IRecordType[]
  type?: CID
  onTypeChange: (type: CID | undefined) => void
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
      <Button
        variant={undefined === selected ? 'contained' : 'outlined'}
        onClick={() => onTypeChange(undefined)}
      >
        all
      </Button>
      {types.map(({ type, label }: IRecordType) => (
        <Button
          key={type.toString()}
          variant={type === selected ? 'contained' : 'outlined'}
          onClick={() => onTypeChange(type)}
        >
          {label}
        </Button>
      )
      )}
    </ButtonGroup>
  );
};
