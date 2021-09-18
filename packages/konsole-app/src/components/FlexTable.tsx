//
// Copyright 2021 DXOS.org
//

import React from 'react';

import {
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination
} from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflow: 'hidden'
  },
  tableCell: {
    verticalAlign: 'top'
  },
  tablePagination: {
    display: 'flex',
    flexShrink: 0,
    flexDirection: 'row-reverse'
  }
}));

interface FlexTableColumn {
  id: string
  label?: string
}

interface FlexTableCellRenderer {
  id: string
  row: any
}

interface FlexTableProps {
  columns: FlexTableColumn[]
  rows: any[],
  cellRenderer?: (props: FlexTableCellRenderer) => JSX.Element | undefined
}

export const FlexTable = ({ columns, rows, cellRenderer }: FlexTableProps) => {
  const classes = useStyles();

  // TODO(burdon): Expand multi-row.
  // TODO(burdon): Sorting.
  // TODO(burdon): Filtering.
  // TODO(burdon): Custom cell class.

  // https://mui.com/components/tables
  return (
    <div className={classes.root}>
      <TableContainer>
        <Table stickyHeader aria-label='sticky table'>
          <TableHead>
            <TableRow>
              {columns.map(({ id, label }) => (
                <TableCell key={id} classes={{ root: classes.tableCell }}>
                  {label || id}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRow>
                {columns.map(({ id }) => {
                  const value = row[id];
                  const element = cellRenderer && cellRenderer({ id, row });
                  return (
                    <TableCell key={id} classes={{ root: classes.tableCell }}>
                      {element ? element : <div>{value}</div>}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        classes={{ root: classes.tablePagination }}
        component='div'
        rowsPerPageOptions={[25, 100]}
        rowsPerPage={25}
        count={rows.length}
        page={1}
        onPageChange={() => {}}
        onRowsPerPageChange={() => {}}
      />
    </div>
  )
};
