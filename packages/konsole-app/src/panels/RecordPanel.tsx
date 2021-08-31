//
// Copyright 2021 DXOS.org
//

import React, { useEffect, useState } from 'react';

import { makeStyles, IconButton, Toolbar, TextField, Divider } from '@material-ui/core';
import {
  Clear as ClearIcon,
  Sync as RefreshIcon
} from '@material-ui/icons';

import { RecordTable, RecordTypeSelector } from '../components';
import {IRecord, IRecordType} from '../registry';
import {useRegistryClient} from "../hooks";

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

const delay = 100;

/**
 * Display records panel
 * @constructor
 */
export const RecordPanel = () => {
  const classes = useStyles();
  const registryClient = useRegistryClient();
  const [recordType, setRecordType] = useState<string | undefined>(undefined);
  const [recordTypes, setRecordTypes] = useState<IRecordType[]>([]);
  const [records, setRecords] = useState<IRecord[]>([]);
  const [search, setSearch] = useState('');
  const [delayedSearch, setDelayedSearch] = useState(search);

  function refreshData() {
    (async function() {
      setRecords([]);
      setRecordTypes(await registryClient.getRecordTypes());
      setRecords(await registryClient.queryRecords({ type: recordType, text: delayedSearch }));
    })();
  }

  useEffect(refreshData, [recordType, delayedSearch]);

  useEffect(() => {
    const t = setTimeout(() => {
      clearTimeout(t);
      setDelayedSearch(search);
    }, delay);

    return () => {
      clearTimeout(t);
    }
  }, [search])

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
            setDelayedSearch('');
          }}
        >
          <ClearIcon />
        </IconButton>
        <div className={classes.expand} />
        <Divider className={classes.divider} orientation="vertical" />
        <IconButton
          className={classes.iconButton}
          size='small'
          aria-label='refresh'
          onClick={refreshData}
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
