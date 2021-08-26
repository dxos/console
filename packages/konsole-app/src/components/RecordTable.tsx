//
// Copyright 2020 DXOS.org
//

import React from 'react';

import { DataGrid } from '@material-ui/data-grid';

import { IRecord } from '../registry';

interface RecordsTableProperties {
  records: IRecord[]
}

// TODO(burdon): Common fields for all records.
// TODO(burdon): Different record type views may have different column sets.
const columns = [
  {
    field: 'cid',
    headerName: 'CID',
    width: 300
  },
  {
    field: 'name',
    headerName: 'Name',
    width: 300
  },
  {
    field: 'type',
    headerName: 'Type',
    width: 120
  },
  {
    field: 'title',
    headerName: 'Title',
    width: 300
  }
];

/**
 * Table that displays all registry records.
 * @constructor
 */
export const RecordTable = ({ records }: RecordsTableProperties) => {
  // https://material-ui.com/components/data-grid/#mit-version
  return (
    <div style={{ height: 58 + 52 * (8 + 1), width: '100%' }}>
      <DataGrid
        rows={records}
        columns={columns}
        getRowId={({ cid }) => cid}
      />
    </div>
  );
};
