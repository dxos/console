//
// Copyright 2021 DXOS.org
//

import React, { useState } from 'react';

import { Divider, IconButton, makeStyles, TextField, Toolbar } from '@material-ui/core';
import { Clear as ClearIcon } from '@material-ui/icons';

import { RecordTable, RecordTypeSelector } from '../components';
import { useConfig, useResources } from '../hooks';
import { mapRecords, mapRecordsTypes } from '../registry';

const useStyles = makeStyles(theme => ({
  toolbar: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  input: {
    flex: 1,
    paddingLeft: theme.spacing(4),
    maxWidth: 300
  },
  iconButton: {
    marginLeft: theme.spacing(1)
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
  const config = useConfig();

  const [recordType, setRecordType] = useState<string>('');
  const [search, setSearch] = useState('');

  const resources = useResources();

  const recordTypes = mapRecordsTypes(resources);
  const records = mapRecords(resources, { text: search, type: recordType }, config);

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
          onClick={() => {
            setSearch('');
          }}
        >
          <ClearIcon />
        </IconButton>
        <div className={classes.expand} />
        <Divider className={classes.divider} orientation="vertical" />
      </Toolbar>
      <div className={classes.panel}>
        <RecordTable records={records} />
      </div>
    </>
  );
};
