//
// Copyright 2022 DXOS.org
//

import React, { useState, useEffect } from 'react';

import { Sync as RefreshIcon, RestartAlt as RestartAltIcon } from '@mui/icons-material';
import { Box, IconButton } from '@mui/material';
import { GridColDef, GridCellParams } from '@mui/x-data-grid';

import { DataGrid, Panel, Toolbar } from '../components';
import { useServices, useConfig, serviceActionRequester, serviceRequester } from '../hooks';

const essentialServices = ['ipfs', 'ipfs-swarm-connect', 'kube'];

const format = new Intl.NumberFormat('en', { maximumSignificantDigits: 3 });

const columns: GridColDef[] = [
  {
    field: 'name',
    headerName: 'Service',
    width: 200,
    cellClassName: 'primary'
  },
  {
    field: 'type',
    headerName: 'Type',
    width: 200
  },
  {
    // TODO(burdon): Color based on status.
    field: 'status',
    headerName: 'Status',
    width: 140
  },
  {
    field: 'cpu',
    headerName: 'CPU',
    width: 140,
    align: 'right',
    cellClassName: 'monospace',
    valueFormatter: ({ value }) => value !== undefined ? (value as number).toFixed(2) : ''
  },
  {
    field: 'memory',
    headerName: 'Memory',
    width: 160,
    align: 'right',
    cellClassName: 'monospace',
    valueFormatter: ({ value }) => value !== undefined ? format.format(value as number / 1000) + 'K' : ''
  }
];

/**
 * Displays the service panel
 */
export const ServicesPanel = () => {
  const config = useConfig();
  const [services, refreshServices] = useServices(true, true);
  const [servicesPrelist, setServicesPrelist] = useState([]);
  const [isActionRunning, setIsActionRunning] = useState(false);

  useEffect(() => {
    const prepopulate = async () => {
      const result = await serviceRequester(config, false, true);
      setServicesPrelist(result.data.map(({ name, type, status }: any) => ({ name, type, status })));
    };
    void prepopulate();
  }, []);

  const handleServiceAction = async (service: string, action: string) => {
    if (confirm(`This action will cause a ${action} of ${service}.`)) {
      setIsActionRunning(true);
      try {
        await serviceActionRequester(config, service, action);
      } finally {
        refreshServices();
        setIsActionRunning(false);
      }
    }
  };

  const columnsWithActions: GridColDef[] = [
    ...columns,
    {
      field: 'action',
      headerName: 'Action',
      width: 120,
      sortable: false,
      align: 'right',
      // https://mui.com/components/data-grid/style/#styling-cells
      renderCell: (params: GridCellParams) => {
        if (!essentialServices.includes(params.row.name)) {
          return (
            <IconButton disabled={isActionRunning} size='small' color='primary' onClick={() => handleServiceAction(params.row.name, 'restart')}>
              <RestartAltIcon />
            </IconButton>
          );
        }
      }
    }
  ];

  return (
    <Panel
      toolbar={(
        <Toolbar>
          <Box sx={{ flex: 1 }} />
          <IconButton
            size='small'
            aria-label='refresh'
            onClick={refreshServices}
          >
            <RefreshIcon />
          </IconButton>
        </Toolbar>
      )}
    >
      <DataGrid
        rows={services || servicesPrelist}
        columns={columnsWithActions}
        getRowId={({ name }) => name}
      />
    </Panel>
  );
};
