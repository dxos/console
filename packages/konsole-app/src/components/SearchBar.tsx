//
// Copyright 2021 DXOS.org
//

import React, { useRef, useState } from 'react';

import { FormControl, IconButton, Input, InputAdornment } from '@mui/material';
import { Clear as ResetIcon } from '@mui/icons-material';

interface SearchBarProps {
  placeholder?: string
  onSearch?: (value?: string) => void
  delay?: number
}

export const SearchBar = ({ placeholder, onSearch, delay = 0 }: SearchBarProps) => {
  const [value, setValue] = useState<string | undefined>();
  const timeout = useRef<ReturnType<typeof setTimeout>>();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value as string;
    setValue(value);

    timeout.current && clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      onSearch && onSearch(value);
    }, delay);
  }

  const handleReset = () => {
    setValue(undefined);
    onSearch && onSearch(undefined);
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Enter': {
        onSearch && onSearch(undefined);
        break;
      }
      case 'Escape': {
        handleReset();
        break;
      }
    }
  }

  return (
    <FormControl
      fullWidth
    >
      <Input
        fullWidth
        autoFocus
        spellCheck={false}
        placeholder={placeholder}
        inputProps={{ 'aria-label': 'search' }}
        value={value || ''}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        endAdornment={(
          <InputAdornment position='end'>
            <IconButton
              color='info'
              onClick={handleReset}
            >
              <ResetIcon />
            </IconButton>
          </InputAdornment>
        )}
      />
    </FormControl>
  );
};
