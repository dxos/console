//
// Copyright 2021 DXOS.org
//

import { Sync as RefreshIcon } from '@mui/icons-material';
import { Box, Collapse, IconButton, Paper } from '@mui/material';
import urlJoin from 'proper-url-join';
import React, { useMemo, useState } from 'react';

import { Resource, CID, IQuery, RegistryRecord, RegistryTypeRecord } from '@dxos/registry-api';

import { JsonView, Panel, RecordTable, RecordTypeSelector, SearchBar, Toolbar } from '../components';
import { IConfig, useConfig, useRecordTypes, useResources } from '../hooks';
import { IRecord, IRecordType } from '../types';

// TODO(burdon): Factor out handlers.

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
export const mapRecords = (types: IRecordType[], resources: Resource[], config: IConfig): IRecord[] => {
  return resources.map(resource => {
    const type = getRecordTypeString(types, resource);
    // TODO(burdon): App type const?
    const url = (type === '.dxos.App')
      ? urlJoin(config.services.app.server, config.services.app.prefix, resource.id.toString())
      : undefined;

    const result: IRecord = {
      cid: resource.record.cid.toB58String(),
      // TODO(marcin): Currently registry API does not expose that. Add that to the DTO.
      created: resource.record.meta.created,
      name: resource.id.toString(),
      type: type || '', // TODO(burdon): ???
      title: resource.record.meta.name
    };

    if (url) {
      result.url = url;
    }

    if (RegistryRecord.isDataRecord(resource.record)) {
      result.data = resource.record.data;
    }

    return result;
  });
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
  const [selected, setSelected] = useState<string | undefined>();
  const registryRecordTypes = useRecordTypes(undefined) ?? [];
  const [recordType, setRecordType] = useState<CID | undefined>(undefined);
  const [search, setSearch] = useState<string | undefined>();
  const query = useMemo<IQuery>(() => ({ type: recordType, text: search }), [recordType, search]);

  const recordTypes = mapTypes(registryRecordTypes);
  const resources = useResources(query) ?? [];
  const records = mapRecords(recordTypes, resources, config);

  const handleSearch = (text: string | undefined) => {
    setSearch(text);
  };

  const handleRefresh = () => {
    setRecordType(undefined);
  };

  return (
    <Panel
      toolbar={(
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
      )}
    >
      <RecordTable
        records={records}
        onSelect={setSelected}
      />

      <Collapse in={selected !== undefined} timeout='auto' unmountOnExit>
        <Paper
          sx={{
            marginTop: 1,
            height: 304,
            overflow: 'scroll',
            padding: 1
          }}
        >
          <JsonView data={records.find(record => record.cid === selected)} />
        </Paper>
      </Collapse>
    </Panel>
  );
};
