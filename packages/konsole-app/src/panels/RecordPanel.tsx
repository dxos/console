//
// Copyright 2021 DXOS.org
//

import urlJoin from 'proper-url-join';
import React, { useEffect, useMemo, useState } from 'react';

import { Divider, IconButton, makeStyles, TextField, Toolbar } from '@material-ui/core';
import { Clear as ClearIcon, Sync as RefreshIcon } from '@material-ui/icons';

import { Resource, CID, IQuery, RegistryRecord, RegistryTypeRecord } from '@dxos/registry-api';

import { RecordTable, RecordTypeSelector } from '../components';
import { IConfig, useConfig, useResources } from '../hooks';
import { useRecordTypes } from '../hooks/useRecordTypes';

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

export interface IRecordType {
  type: CID
  label: string
}

export interface IRecord {
  cid: string
  created?: string
  name: string
  type: string
  title?: string
  url?: string
}

function getRecordTypeString (types: IRecordType[], res: Resource): string {
  const record = res.record;
  if (RegistryRecord.isTypeRecord(record)) {
    return 'type';
  } else if (RegistryRecord.isDataRecord(record)) {
    const matches = types.filter(({ type }) => type.equals(record.type));
    if (matches.length !== 1) {
      throw new Error('Type not found');
    }

    return matches[0].label;
  } else {
    return 'expected two types' as never;
  }
}

export function mapRecords (types: IRecordType[], records: Resource[], config: IConfig): IRecord[] {
  return records.map(apiRecord => ({
    cid: apiRecord.record.cid.toB58String(),
    // TODO (marcin): Currently registry API does not expose that. Add that to the DTO.
    created: apiRecord.record.meta.created,
    name: apiRecord.id.toString(),
    type: getRecordTypeString(types, apiRecord),
    title: apiRecord.record.meta.name,
    url: urlJoin(
      config.services.app.server,
      config.services.app.prefix,
      apiRecord.id.toString())
  }));
}

export function mapTypes (records: RegistryTypeRecord[]): IRecordType[] {
  return records.map(apiRecord => ({
    type: apiRecord.cid,
    label: apiRecord.messageName
  }));
}

/**
 * Display records panel
 * @constructor
 */
export const RecordPanel = () => {
  const classes = useStyles();
  const config = useConfig();

  const registryRecordTypes = useRecordTypes(undefined) ?? [];
  const [recordType, setRecordType] = useState<CID | undefined>(undefined);
  const [search, setSearch] = useState('');
  const [delayedSearch, setDelayedSearch] = useState(search);
  const query = useMemo<IQuery>(() => ({ type: recordType, text: delayedSearch }), [recordType, delayedSearch]);

  const resources = useResources(query) ?? [];

  const recordTypes = mapTypes(registryRecordTypes);
  const records = mapRecords(recordTypes, resources, config);

  useEffect(() => {
    const t = setTimeout(() => {
      clearTimeout(t);
      setDelayedSearch(search);
    }, delay);

    return () => {
      clearTimeout(t);
    };
  }, [search]);

  function refreshData () {
    setRecordType(undefined);
    setSearch('');
  }

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
