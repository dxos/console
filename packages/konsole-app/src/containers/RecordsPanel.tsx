//
// Copyright 2021 DXOS.org
//

import {
  Sync as RefreshIcon,
  TableRows as TableIcon,
  BubbleChart as GraphIcon
} from '@mui/icons-material';
import { Box, Collapse, IconButton, Paper, ToggleButton, ToggleButtonGroup } from '@mui/material';
import urlJoin from 'proper-url-join';
import React, { useMemo, useState } from 'react';
import { generatePath, useHistory, useParams } from 'react-router';

import { useDomains, useResources, useRecordTypes, useRecords } from '@dxos/react-registry-client';
import { CID, IQuery, RegistryTypeRecord, RegistryRecord, Resource } from '@dxos/registry-client';

import {
  IResource,
  IRecord,
  JsonView,
  Panel,
  RecordsGraph,
  RecordsTable,
  RecordTypeSelector,
  SearchBar,
  Toolbar
} from '../components';
import { useConfig, IConfig } from '../hooks';
import { safe } from '../util';

/**
 * Joins records with record types.
 * @param resources
 * @param recordTypes
 * @param config
 */
export const joinRecords = (records: RegistryRecord[], recordTypes: RegistryTypeRecord[], config: IConfig): IRecord[] => {
  // TODO(burdon): Hack.
  const getRecordTypeString = (record: RegistryRecord, types: RegistryTypeRecord[]): string | undefined => {
    if (RegistryRecord.isDataRecord(record)) {
      const matches = types.filter(({ cid }) => cid.equals(record.type));
      if (matches.length !== 1) {
        return;
      }

      return matches[0].messageName;
    }
  };

  return records.map(registryRecord => {
    const record: IRecord = {
      cid: registryRecord.cid,
    };

    const type = getRecordTypeString(registryRecord, recordTypes);
    if (type) {
      record.type = type;
    }

    // TODO(burdon): Move to Resrouce.
    const url = (type === '.dxos.type.App')
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

const views = [
  { key: 'table', Icon: TableIcon },
  { key: 'graph', Icon: GraphIcon }
];

const ViewSelector = ({ view, onChange }: { view: string, onChange: (view: string) => void }) => {
  const handleChange = (event: React.MouseEvent<HTMLElement>, view: string) => {
    onChange(view);
  };

  return (
    <ToggleButtonGroup
      exclusive
      value={view}
      onChange={handleChange}
      size='small'
      sx={{
        marginRight: 4
      }}
    >
      {views.map(({ key, Icon }) => (
        <ToggleButton
          key={key}
          value={key}
          color='primary'
        >
          <Icon />
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

// TODO(burdon): Render is not visible (to maintain state).
const ViewPanel = ({ children, visible }: { children: React.ReactNode, visible: boolean }) => (
  <>
    {visible && children}
  </>
);

/**
 * Display records panel
 */
export const RecordsPanel = ({ match }: { match?: any }) => {
  const config = useConfig();
  const history = useHistory();
  const { cid }: { cid: string } = useParams();
  const selected = safe<CID>(() => CID.fromB58String(cid));

  const [view, setView] = useState(views[0].key);
  const [recordType, setRecordType] = useState<CID | undefined>(undefined);
  const [search, setSearch] = useState<string | undefined>();
  const query = useMemo<IQuery>(() => ({ type: recordType, text: search }), [recordType, search]);

  const { domains } = useDomains();
  const { recordTypes } = useRecordTypes();
  const {records: registryRecords} = useRecords(query);
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
          <ViewSelector view={view} onChange={setView} />
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
      <ViewPanel visible={view === 'table'}>
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
            <JsonView data={selected && records.find(record => record.cid.equals(selected))} />
          </Paper>
        </Collapse>
      </ViewPanel>
      <ViewPanel visible={view === 'graph'}>
        <RecordsGraph
          domains={domains}
          records={records}
        />
      </ViewPanel>
    </Panel>
  );
};
