//
// Copyright 2021 DXOS.org
//

import urlJoin from 'proper-url-join';
import React, { useEffect, useMemo, useState } from 'react';

import { Divider, IconButton, makeStyles, TextField, Toolbar } from '@material-ui/core';
import { Clear as ClearIcon, Sync as RefreshIcon } from '@material-ui/icons';

import { Resource } from '@dxos/registry-api';

import { RecordTable, RecordTypeSelector } from '../components';
import { IConfig, useConfig, useResources } from '../hooks';

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
  type: string
  label: string
}

export function mapRecordsTypes (records: Resource[]): IRecordType[] {
  const mapped = records.map(apiRecord => ({
    type: apiRecord.messageFqn,
    label: apiRecord.messageFqn
  }));

  return Object.values(Object.fromEntries(mapped.map(record => [record.type, record])));
}

export interface IRecord {
  cid: string
  created: number
  name: string
  type: string
  title: string
  url?: string
}

export function mapRecords (records: Resource[], config: IConfig): IRecord[] {
  return records.map(apiRecord => ({
    cid: apiRecord.cid.toB58String(),
    // TODO (marcin): Currently registry API does not expose that. Add that to the DTO.
    created: apiRecord.data?.attributes?.created,
    name: `${apiRecord.id.domain}:${apiRecord.id.resource}`,
    type: apiRecord.messageFqn,
    title: apiRecord.data?.attributes?.name,
    url: urlJoin(
      config.services.app.server,
      config.services.app.prefix,
        `${apiRecord.id.domain}:${apiRecord.id.resource}`)
  }));
}

/**
 * Display records panel
 * @constructor
 */
export const RecordPanel = () => {
  const classes = useStyles();
  const config = useConfig();

  const [recordTypes, setRecordTypes] = useState<IRecordType[]>([]);
  const [recordType, setRecordType] = useState<string | undefined>(undefined);
  const [search, setSearch] = useState('');
  const [delayedSearch, setDelayedSearch] = useState(search);
  const query = useMemo(() => ({ type: recordType, text: delayedSearch }), [recordType, delayedSearch]);

  const resources = useResources(query) ?? [];

  const newRecordTypes = mapRecordsTypes(resources);
  if (newRecordTypes.length > recordTypes.length) {
    setRecordTypes(newRecordTypes);
  }
  const records = mapRecords(resources, config);

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
