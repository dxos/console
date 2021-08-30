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

const delay = 500;

/**
 * Display records panel
 * @constructor
 */
export const RecordPanel = () => {
  const classes = useStyles();
  const registryClient = useRegistryClient();
  const [recordType, setRecordType] = useState<string>('');
  const [recordTypes, setRecordTypes] = useState<IRecordType[]>([]);
  const [records, setRecords] = useState<IRecord[]>([]);
  const [search, setSearch] = useState('');
  const [delayedSearch, setDelayedSearch] = useState(search);

  useEffect(() => {
    const fetchRecordTypes = async () => {
      setRecordTypes(await registryClient.getRecordTypes());
    };
    // TODO(marcin): Create subscription to registry client being ready instead of retrying till it succeeds.
    setTimeout(() => fetchRecordTypes(), 2000);
  }, [(registryClient as any).state]);

  useEffect(() => {
    const fetchRecords = async () => {
      setRecords(await registryClient.queryRecords(undefined));
    };
    fetchRecords();
  }, [recordTypes]);

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
          // TODO(vitalik): Fix refetching with filtering on type change.
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
          // onClick={refreshRecords} TODO (marcin): Fix refetching when fixing subscribing to the connect event.
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
