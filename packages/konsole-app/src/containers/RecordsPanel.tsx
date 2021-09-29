//
// Copyright 2021 DXOS.org
//

import {
  Sync as RefreshIcon,
  TableRows as TableIcon,
  BubbleChart as GraphIcon
} from '@mui/icons-material';
import { Box, Collapse, IconButton, Paper, ToggleButton, ToggleButtonGroup } from '@mui/material';
import React, { useMemo, useState } from 'react';
import { generatePath, useHistory, useParams } from 'react-router';

import { CID, IQuery } from '@dxos/registry-api';

import { JsonView, Panel, RecordGraph, RecordTable, RecordTypeSelector, SearchBar, Toolbar } from '../components';
import { useConfig, useDomains, useRecordTypes, useResources, joinRecords } from '../hooks';
import { safe } from '../util';

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
export const RecordsPanel = ({ match }: { match?: any }) => { // TODO(burdon): Type?
  const config = useConfig();
  const history = useHistory();
  const { cid }: { cid: string } = useParams();
  const selected = safe<CID>(() => CID.fromB58String(cid));

  const [view, setView] = useState(views[0].key);
  const [recordType, setRecordType] = useState<CID | undefined>(undefined);
  const [search, setSearch] = useState<string | undefined>();
  const query = useMemo<IQuery>(() => ({ type: recordType, text: search }), [recordType, search]);

  const domains = useDomains();
  const recordTypes = useRecordTypes();

  // TODO(burdon): This should only show records; separate view for resources => record.
  const resources = useResources(query) ?? [];
  const records = joinRecords(resources, recordTypes, config);

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
        <RecordTable
          records={records}
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
        <RecordGraph
          domains={domains}
          records={records}
        />
      </ViewPanel>
    </Panel>
  );
};
