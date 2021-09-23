//
// Copyright 2021 DXOS.org
//

import React from 'react';

import { Divider, FormControl, MenuItem, Select, SelectChangeEvent } from '@mui/material';

import { CID } from '@dxos/registry-api';

import { IRecordType } from '../types';

interface RecordTypeSelectorProps {
  types?: IRecordType[]
  type?: CID
  onChange: (type: CID | undefined) => void
}

export const RecordTypeSelector = ({ types = [], type: selected, onChange }: RecordTypeSelectorProps) => {
  const handleChange = (event: SelectChangeEvent) => {
    const value = event.target.value as string;
    const recordType = value ? types.find(({ type }) => type.equals(value)) : undefined;
    onChange(recordType?.type);
  };

  return (
    <FormControl variant='standard'>
      <Select
        labelId='label-record-type'
        value={selected?.toString() || ''}
        onChange={handleChange}
        displayEmpty
        autoWidth
      >
        <MenuItem value=''>ALL</MenuItem>
        <Divider />
        {types.map(({ type, label }: IRecordType) => (
          <MenuItem
            key={type.toString()}
            value={type.toString()}
          >
            {label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  /*
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
  */
};
