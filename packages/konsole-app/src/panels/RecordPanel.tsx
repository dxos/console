//
// Copyright 2020 DXOS.org
//

import React, { useState } from 'react';

import { makeStyles, IconButton, Toolbar, TextField, Divider } from '@material-ui/core';
import {
  Search as SearchIcon,
  Sync as RefreshIcon
} from '@material-ui/icons';

import { RecordTable, RecordTypeSelector } from '../components';
import { useRecordTypes, useRecords } from '../hooks';

const useStyles = makeStyles(theme => ({
  toolbar: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  input: {
    flex: 1,
    paddingLeft: theme.spacing(4)
  },
  iconButton: {
    marginLeft: theme.spacing(1)
  },
  searchBar: {
    flex: 1
  },
  panel: {
    display: 'flex',
    flex: 1
  },
  divider: {
    height: 28,
    margin: 4
  },
  expand: {
    flex: 1
  }
}));

/**
 * Display records panel
 * @constructor
 */
export const RecordPanel = () => {
  const classes = useStyles();
  const recordTypes = useRecordTypes();
  const [recordType, setRecordType] = useState<string>(recordTypes[0].type);
  const [search, setSearch] = useState('');
  const [records, refreshRecords] = useRecords({ type: recordType, text: search });

  return (
    <>
      <Toolbar className={classes.toolbar} disableGutters>
        <RecordTypeSelector
          types={recordTypes}
          type={recordType}
          onTypeChange={type => setRecordType(type)}
        />
        <TextField
          className={classes.input}
          placeholder='Search records'
          inputProps={{ 'aria-label': 'search' }}
          value={search}
          onChange={event => setSearch(event.target.value)}
          onKeyDown={event => (event.key === 'Escape') && setSearch('')}
        />
        <IconButton
          className={classes.iconButton}
          size='small'
          aria-label='search'
        >
          <SearchIcon />
        </IconButton>
        <div className={classes.expand} />
        <Divider className={classes.divider} orientation="vertical" />
        <IconButton
          className={classes.iconButton}
          size='small'
          aria-label='refresh'
          onClick={refreshRecords}
        >
          <RefreshIcon />
        </IconButton>
      </Toolbar>
      <div className={classes.panel}>
        <RecordTable records={records} />
      </div>
    </>
  );
};
