//
// Copyright 2021 DXOS.org
//

import urlJoin from 'proper-url-join';
import React, { useEffect, useMemo, useState } from 'react';

import { Divider, IconButton, TextField, Toolbar } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Clear as ClearIcon,
  Sync as RefreshIcon
} from '@mui/icons-material';

import { Resource, CID, IQuery, RegistryRecord, RegistryTypeRecord } from '@dxos/registry-api';

import { RecordTable, RecordTypeSelector } from '../components';
import { IConfig, useConfig, useRecordTypes, useResources } from '../hooks';

const useStyles = makeStyles(theme => ({
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

// TODO(burdon): Comment.
const getRecordTypeString = (types: IRecordType[], res: Resource): string | undefined => {
  const record = res.record;
  if (RegistryRecord.isTypeRecord(record)) {
    return 'type'; // TODO(burdon): Const from protobuf?
  } else if (RegistryRecord.isDataRecord(record)) {
    const matches = types.filter(({ type }) => type.equals(record.type));
    if (matches.length !== 1) {
      return;
    }

    return matches[0].label;
  }
};

// TODO(burdon): Comment.
export const mapRecords = (types: IRecordType[], records: Resource[], config: IConfig): IRecord[] => {
  return records.map(record => ({
    cid: record.record.cid.toB58String(),
    // TODO(marcin): Currently registry API does not expose that. Add that to the DTO.
    created: record.record.meta.created,
    name: record.id.toString(),
    type: getRecordTypeString(types, record) || '', // TODO(burdon): ???
    title: record.record.meta.name,
    url: urlJoin(
      config.services.app.server,
      config.services.app.prefix,
      record.id.toString()
    )
  }));
};

// TODO(burdon): Comment.
export const mapTypes = (records: RegistryTypeRecord[]): IRecordType[] => {
  return records.map(apiRecord => ({
    type: apiRecord.cid,
    label: apiRecord.messageName
  }));
};

/**
 * Display records panel
 * @constructor
 */
export const RecordPanel = () => {
  const classes = useStyles();
  const config = useConfig();
  const delay = 500;

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
      <Toolbar>
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
