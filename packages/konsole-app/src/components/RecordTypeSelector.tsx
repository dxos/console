//
// Copyright 2021 DXOS.org
//

import React from 'react';

import { Button, ButtonGroup } from '@mui/material';

import { CID } from '@dxos/registry-api';

import { IRecordType } from '../types';

interface RecordTypeSelectorProps {
  types?: IRecordType[]
  type?: CID
  onChange: (type: CID | undefined) => void
}

export const RecordTypeSelector = ({ types = [], type: selected, onChange }: RecordTypeSelectorProps) => {
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
        onClick={() => onChange(undefined)}
      >
        ANY
      </Button>
      {types.map(({ type, label }: IRecordType) => (
        <Button
          key={type.toString()}
          variant={selected && type.equals(selected) ? 'contained' : 'outlined'}
          onClick={() => onChange(type)}
        >
          {label}
        </Button>
      )
      )}
    </ButtonGroup>
  );
};
