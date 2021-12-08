//
// Copyright 2021 DXOS.org
//

import { Sync as RefreshIcon } from '@mui/icons-material';
import { Box, Collapse, IconButton, Paper } from '@mui/material';
import urlJoin from 'proper-url-join';
import React, { useMemo, useState } from 'react';
import { generatePath, useHistory, useParams } from 'react-router';

import { JsonTreeView, Searchbar } from '@dxos/react-components';
import { useRecords, useRecordTypes } from '@dxos/react-registry-client';
import { CID, IQuery, RegistryRecord, RegistryTypeRecord } from '@dxos/registry-client';

import {
  IRecord,
  Panel,
  RecordsTable,
  RecordTypeSelector,
  Toolbar
} from '../components';
import { IConfig, useConfig } from '../hooks';
import { getRecordTypeData, safe } from '../util';

/**
 * Joins records with record types.
 * @param resources
 * @param recordTypes
 * @param config
 */
export const joinRecords = (records: RegistryRecord[], recordTypes: RegistryTypeRecord[], config: IConfig): IRecord[] => {
  return records.map(registryRecord => {
    const record: IRecord = {
      cid: registryRecord.cid,
      created: registryRecord.meta.created,
      description: registryRecord.meta.description,
      type: registryRecord.kind
    };

    const { typeName: type } = getRecordTypeData(registryRecord, recordTypes);
    if (type) {
      record.type = type;
    }

    const url = (type === 'App')
      ? urlJoin(config.services.app.server, config.services.app.prefix, registryRecord.cid.toString())
      : undefined;
    if (url) {
      record.url = url;
    }

    if (RegistryRecord.isDataRecord(registryRecord)) {
      record.data = registryRecord.data;
    }

    return record;
  });
};

/**
 * Display records panel
 */
export const RecordsPanel = ({ match }: { match?: any }) => {
  const config = useConfig();
  const history = useHistory();
  const { cid }: { cid?: string } = useParams();
  const selected = safe<CID | undefined>(() => cid ? CID.fromB58String(cid) : undefined);

  const [recordType, setRecordType] = useState<CID | undefined>(undefined);
  const [search, setSearch] = useState<string | undefined>();
  const query = useMemo<IQuery>(() => ({ type: recordType, text: search }), [recordType, search]);

  const { recordTypes } = useRecordTypes();
  const { records: registryRecords } = useRecords(query);
  const records = joinRecords(registryRecords, recordTypes, config);

  const handleSelect = (cid: CID | undefined) => {
    history.push(generatePath(match.path, { cid: cid ? cid.toB58String() : undefined }));
  };

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
            <Searchbar
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
      <RecordsTable
        records={records}
        selected={selected}
        onSelect={handleSelect}
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
          <JsonTreeView data={selected && records.find(record => record.cid.equals(selected.toB58String()))} />
        </Paper>
      </Collapse>
    </Panel>
  );
};
