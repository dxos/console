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

import { CID, IQuery } from '@dxos/registry-api';

import { JsonView, Panel, RecordGraph, RecordTable, RecordTypeSelector, SearchBar, Toolbar } from '../components';
import { useConfig, useRecordTypes, useResources, mapRecordTypes, mapRecords } from '../hooks';

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
export const RecordPanel = () => {
  const config = useConfig();

  const [view, setView] = useState(views[0].key);
  const [selected, setSelected] = useState<string | undefined>();
  const [recordType, setRecordType] = useState<CID | undefined>(undefined);
  const [search, setSearch] = useState<string | undefined>();
  const query = useMemo<IQuery>(() => ({ type: recordType, text: search }), [recordType, search]);

  const recordTypes = mapRecordTypes(useRecordTypes());
  const resources = useResources(query) ?? [];
  const records = mapRecords(resources, recordTypes, config);

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
      </ViewPanel>
      <ViewPanel visible={view === 'graph'}>
        <RecordGraph
          records={records}
        />
      </ViewPanel>
    </Panel>
  );
};
