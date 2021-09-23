//
// Copyright 2021 DXOS.org
//

import urlJoin from 'proper-url-join';
import React, { useEffect, useMemo, useState } from 'react';

import { Box, Divider, IconButton, TextField, Toolbar } from '@mui/material';
import {
  Clear as ClearIcon,
  Sync as RefreshIcon
} from '@mui/icons-material';

import { Resource, CID, IQuery, RegistryRecord, RegistryTypeRecord } from '@dxos/registry-api';

import { RecordTable, RecordTypeSelector, SearchBar } from '../components';
import { IConfig, useConfig, useRecordTypes, useResources } from '../hooks';
import { IRecord, IRecordType } from '../types';

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

  const handleSearch = (search: string | undefined) => {
    console.log(search);
  };

  const handleRefresh = () => {
    setRecordType(undefined);
    setSearch('');
  };

  return (
    <>
      <Toolbar>
        <Box>
          <RecordTypeSelector
            types={recordTypes}
            type={recordType}
            onChange={type => setRecordType(type)}
          />
        </Box>
        <Box sx={{ flex: 1 }} />
        {/* Search */}
        <Box
          sx={{
            minWidth: 350
          }}
        >
          <SearchBar
            placeholder='Search records'
            onSearch={handleSearch}
            delay={500}
          />
        </Box>
        <Divider
          orientation="vertical"
          sx={{
            margin: 4
          }}
        />
        <IconButton
          sx={{
            marginLeft: 1
          }}
          size='small'
          aria-label='refresh'
          onClick={handleRefresh}
        >
          <RefreshIcon />
        </IconButton>
      </Toolbar>

      <Box
        sx={{
          display: 'flex',
          flex: 1,
          padding: 1
        }}
      >
        <RecordTable records={records} />
      </Box>
    </>
  );
};
