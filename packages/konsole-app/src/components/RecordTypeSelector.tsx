//
// Copyright 2021 DXOS.org
//

import { Divider, FormControl, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import React from 'react';

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
};
