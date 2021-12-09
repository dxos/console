//
// Copyright 2021 DXOS.org
//

import urlJoin from 'proper-url-join';
import React, { useEffect, useMemo, useState } from 'react';
import { generatePath, useHistory, useParams } from 'react-router';
import semver from 'semver';

import {
  Sync as RefreshIcon,
  BubbleChart as GraphIcon,
  TableRows as TableIcon
} from '@mui/icons-material';
import { Box, Collapse, IconButton, Paper, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';

import { Searchbar } from '@dxos/react-components';
import { useDomains, useRecords, useRecordTypes, useRegistry, useResources } from '@dxos/react-registry-client';
import { CID, DXN, IQuery, Resource } from '@dxos/registry-client';

import { DataGrid, IRecord, IResourceRecord, Panel, ResourceRecordsTable, Toolbar } from '../components';
import { RegistryGraph } from '../components/RegistryGraph';
import { IConfig, useConfig } from '../hooks';
import { joinRecords } from './RecordsPanel';

export interface DisplayResource extends Resource {
  latestVersion: string,
  latestTag: string
}

/**
 * Joins records with resources.
 */
export const joinResourceRecords = (records: IRecord[], resource: Resource | undefined, config: IConfig): IResourceRecord[] => {
  if (!resource) {
    return [];
  }

  const mapRecords = (field: 'version' | 'tag') => ([versionOrTag, cid]: [string, CID | undefined]) => {
    const record = records.find(record => cid && record.cid.equals(cid));
    if (!record) {
      return undefined;
    }
    const resourceRecord: IResourceRecord = {
      ...record,
      [field]: versionOrTag,

      url: (record.type === '.dxos.type.App')
        ? urlJoin(config.services.app.server, config.services.app.prefix, `${resource.id.toString()}@${versionOrTag}`)
        : undefined
    };
    return resourceRecord;
  };

  const taggedRecords = Object.entries(resource.tags).map(mapRecords('tag'));
  const versionedRecords = Object.entries(resource.versions).map(mapRecords('version'));

  return [
    ...taggedRecords.filter(record => record !== undefined),
    ...versionedRecords.filter(record => record !== undefined)
  ] as IResourceRecord[];
};

const columns: GridColDef[] = [
  {
    field: 'id', // TODO(burdon): Rename?
    headerName: 'DXN',
    width: 700,
    cellClassName: 'monospace primary'
  },
  {
    field: 'latestVersion',
    headerName: 'Latest version',
    width: 300,
    cellClassName: 'monospace secondary'
  },
  {
    field: 'latestTag',
    headerName: 'Latest tag',
    width: 300,
    cellClassName: 'monospace secondary'
  }
];

type View = 'graph' | 'table'
const views = [
  { key: 'table', Icon: TableIcon },
  { key: 'graph', Icon: GraphIcon }
] as const;

const ViewSelector = ({ view, onChange }: { view: string, onChange: (view: View) => void }) => {
  const handleChange = (event: React.MouseEvent<HTMLElement>, view: View) => {
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
 * Displays the resources.
 */
export const ResourcesPanel = ({ match }: { match?: any }) => {
  const config = useConfig();
  const { domains } = useDomains();
  const [search, setSearch] = useState<string | undefined>();
  const query = useMemo<IQuery>(() => ({ text: search }), [search]);
  const { resources: rawResources } = useResources(query);
  const [resources, setResources] = useState<DisplayResource[]>([]);
  const registry = useRegistry();
  const [view, setView] = useState<View>(views[0].key);
  const { dxn }: { dxn?: string } = useParams();
  const history = useHistory();
  const selectedResource = resources.find(resource => resource.id.toString() === dxn?.toString());
  const { recordTypes } = useRecordTypes();
  const { records: registryRecords } = useRecords();
  const records = joinRecords(registryRecords, recordTypes, config);
  const resourceRecords = joinResourceRecords(records, selectedResource, config);

  useEffect(() => {
    void (async () => {
      const latestTags = await Promise.all(rawResources.map(async resource => {
        const tagRecords = await Promise.all(Object.values(resource.tags).map(cid => cid && registry.getRecord(cid)));
        const latestTag = tagRecords.reduce((prev, current) => {
          if (!current?.meta.created) {
            return prev;
          }
          if (prev?.meta.created) {
            return (current.meta.created.getTime() - prev.meta.created.getTime()) > 0 ? current : prev;
          }
          return current;
        }, undefined);
        if (!latestTag) {
          return undefined;
        }
        return Object.keys(resource.tags).find(key => resource.tags[key]?.equals(latestTag.cid));
      }));
      const withTags = rawResources.map((resource, i) => ({ ...resource, latestTag: latestTags[i] ?? '' }));
      const withVersions: DisplayResource[] = withTags.map(resource => ({
        ...resource,
        latestVersion: semver.maxSatisfying(Object.keys(resource.versions), '*') ?? ''
      }));
      setResources(withVersions);
    })();
  }, [rawResources]);

  const onSelected = (dxn: DXN) => {
    const next = (dxn.toString() === selectedResource?.id.toString()) ? undefined : dxn;
    history.push(generatePath(match.path, { dxn: next?.toString() }));
  };

  const handleSearch = (text: string | undefined) => {
    setSearch(text);
  };

  return (
    <Panel
      toolbar={(
        <Toolbar>
          <ViewSelector view={view} onChange={setView} />
          <Box sx={{ flex: 1 }} />
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
            size='small'
            aria-label='refresh'
            onClick={() => {}}
          >
            <RefreshIcon />
          </IconButton>
        </Toolbar>
      )}
    >
      <ViewPanel visible={view === 'table'}>
        <DataGrid
          rows={resources || []}
          columns={columns}
          getRowId={({ id }) => id.toString()}
          selectionModel={selectedResource ? [selectedResource?.id.toString()] : []}
          onRowClick={({ id }) => onSelected(id as unknown as DXN)}
          disableSelectionOnClick
          hideFooterSelectedRowCount
        />
        <Collapse in={selectedResource !== undefined} timeout='auto' unmountOnExit>
            <Paper
              sx={{
                marginTop: 1,
                height: 304,
                overflow: 'hidden',
                padding: 1
              }}
            >
              <ResourceRecordsTable
                resourceRecords={resourceRecords}
              />
            </Paper>
          </Collapse>
        </ViewPanel>
        <ViewPanel visible={view === 'graph'}>
          <RegistryGraph
            domains={domains}
            records={selectedResource ? resourceRecords : records}
            resources={selectedResource ? [selectedResource] : resources}
          />
      </ViewPanel>
    </Panel>
  );
};
