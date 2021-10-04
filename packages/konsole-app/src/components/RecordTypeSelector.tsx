//
// Copyright 2021 DXOS.org
//

import { Divider, FormControl, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import React from 'react';

import { CID, RegistryTypeRecord } from '@dxos/registry-client';

interface RecordTypeSelectorProps {
  types?: RegistryTypeRecord[]
  type?: CID
  onChange: (type: CID | undefined) => void
}

export const RecordTypeSelector = ({ types = [], type: selected, onChange }: RecordTypeSelectorProps) => {
  const handleChange = (event: SelectChangeEvent) => {
    const value = event.target.value as string;
    const recordType = value ? types.find(({ cid }) => cid.equals(value)) : undefined;
    onChange(recordType?.cid);
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
        {types.map(({ cid, messageName }: RegistryTypeRecord) => (
          <MenuItem
            key={cid.toString()}
            value={cid.toString()}
          >
            {messageName}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
