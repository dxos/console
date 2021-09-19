//
// Copyright 2021 DXOS.org
//

import React from 'react';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel
} from '@mui/material';

interface FlexTableColumn {
  id: string
  label?: string
  width?: number
  sort?: boolean
}

interface FlexTableCellRenderer {
  classes: any
  id: string
  row: any
}

interface FlexTableRowRenderer {
  classes: any
  key: string
  columns: FlexTableColumn[]
  row: any
  cellRenderer?: (props: FlexTableCellRenderer) => JSX.Element | undefined
}

interface FlexTableProps {
  columns: FlexTableColumn[]
  rows: any[],
  rowRenderer?: (props: FlexTableRowRenderer) => JSX.Element | undefined
  cellRenderer?: (props: FlexTableCellRenderer) => JSX.Element | undefined
  paging?: boolean
}

export const defaultRowRenderer = ({ classes, key, columns, row, cellRenderer }: FlexTableRowRenderer) => {
  return (
    <TableRow key={key}>
      {columns.map(({ id }) => {
        let element = row[id];
        if (cellRenderer) {
          element = cellRenderer({ classes, row, id });
          if (element === undefined) {
            element = row[id];
          }
        }

        return (
          <TableCell key={id} classes={{ root: classes.tableCell }}>
            {element}
          </TableCell>
        )
      })}
    </TableRow>
  )
}

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

export const FlexTable = ({ columns, rows, rowRenderer, cellRenderer, paging }: FlexTableProps) => {
  const classes = useStyles();

  // TODO(burdon): Expand multi-row.
  // TODO(burdon): Sorting.
  // TODO(burdon): Filtering.

  // https://mui.com/components/tables
  return (
    <div
      sx={{

      }}
    >
      <TableContainer>
        <Table stickyHeader aria-label='sticky table' sx={{ minWidth: 600 }}>
          <TableHead>
            <TableRow>
              {columns.map(({ id, label, width, sort }) => {
                const styles = {};

                return (
                  <TableCell key={id} classes={{ root: classes.tableCell }} sx={{ color: 'red' }}>
                    {sort && (
                      <TableSortLabel
                        onClick={() => {}}
                      >
                        {label || id}
                      </TableSortLabel>
                    ) || (label || id)}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, i) => {
              const key = String(i);
              const element = rowRenderer ? rowRenderer({ classes, key, columns, row, cellRenderer }) : undefined;
              if (element !== undefined) {
                return element;
              }

              return defaultRowRenderer({ classes, key, columns, row, cellRenderer });
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {paging && (
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
      )}
    </div>
  )
};
