//
// Copyright 2021 DXOS.org
//

import React, { useEffect, useState } from 'react';

import {
  Box,
  Table,
  TableBody,
  TableCell as MuiTableCell,
  TableCellProps,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel
} from '@mui/material';
import { styled } from '@mui/material/styles';

interface FlexTableColumn {
  id: string
  label?: string
  width?: number
  sort?: boolean
}

interface FlexTableCellRenderer {
  id: string
  row: any
}

interface FlexTableRowRenderer {
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

export const defaultRowRenderer = ({ key, columns, row, cellRenderer }: FlexTableRowRenderer) => {
  return (
    <TableRow key={key}>
      {columns.map(({ id }) => {
        let element = row[id];
        if (cellRenderer) {
          element = cellRenderer({ row, id });
          if (element === undefined) {
            element = row[id];
          }
        }

        return (
          <TableCell key={id}>
            {element}
          </TableCell>
        )
      })}
    </TableRow>
  )
}

const TableCell = styled(MuiTableCell)<TableCellProps>(() => ({
  verticalAlign: 'top'
}));

export const FlexTable = ({ columns, rows: allRows, rowRenderer, cellRenderer, paging }: FlexTableProps) => {
  const pageSizes = [25, 100];
  const [pageSize, setPageSize] = useState<number>(pageSizes[0]);

  //
  // TODO(burdon): Sorting.
  //

  //
  // TODO(burdon): Filtering.
  //

  const handleSort = () => {};

  //
  // Paging.
  //

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setPageSize(parseInt(event.target.value));
  };

  // TODO(burdon): Paging (pass page to external handler to query).
  const [page, setPage] = useState<number>(0);
  const handlePageChange = (_: any, page: number) => {
    setPage(page);
  };

  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => {
    setRows(allRows.slice(page * pageSize, (page + 1) * pageSize));
  }, [allRows, page, pageSize]);

  // TODO(burdon): Expand multi-row.

  // https://mui.com/components/tables
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flex: 1,
        overflow: 'hidden'
      }}
    >
      <TableContainer>
        <Table stickyHeader aria-label='sticky table' sx={{ minWidth: 600 }}>
          <TableHead>
            <TableRow>
              {columns.map(({ id, label, width, sort }) => {
                return (
                  <TableCell key={id} width={width}>
                    {sort && (
                      <TableSortLabel
                        onClick={handleSort}
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
              const element = rowRenderer ? rowRenderer({ key, columns, row, cellRenderer }) : undefined;
              if (element !== undefined) {
                return element;
              }

              return defaultRowRenderer({ key, columns, row, cellRenderer });
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {paging && (
        <TablePagination
          sx={{
            display: 'flex',
            flexShrink: 0,
            flexDirection: 'row-reverse'
          }}
          component='div'
          rowsPerPageOptions={pageSizes}
          rowsPerPage={pageSize}
          count={allRows.length}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      )}
    </Box>
  )
};
