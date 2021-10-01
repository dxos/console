//
// Copyright 2021 DXOS.org
//

import {
  ArrowUpward as UpIcon,
  ArrowDownward as Downicon
} from '@mui/icons-material';
import {
  Box, IconButton, Table, TableCell, TableContainer, TableBody, TableHead, TableRow
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';

interface ScrollState {
  clientHeight: number
  scrollHeight: number
  scrollTop: number
}

const useScrollHandler = (scrollContainerRef: React.RefObject<HTMLDivElement>): [ScrollState, () => void] => {
  const [scrollState, setScrollState] = useState<ScrollState>({
    clientHeight: 0, scrollHeight: 0, scrollTop: 0
  });

  const handleUpdate = () => {
    const { clientHeight = 0, scrollHeight = 0, scrollTop = 0 } = scrollContainerRef.current || {};
    setScrollState({ clientHeight, scrollHeight, scrollTop });
  };

  useEffect(() => {
    window.addEventListener('resize', handleUpdate);
    scrollContainerRef.current!.addEventListener('scroll', handleUpdate);

    return () => {
      window.removeEventListener('resize', handleUpdate);
      scrollContainerRef.current?.removeEventListener('scroll', handleUpdate);
    };
  }, [scrollContainerRef]);

  // Update.
  useEffect(handleUpdate, []);

  return [scrollState, handleUpdate];
};

export type RowData = { [index: string]: any }

interface Column {
  key: string
  title?: string
  width?: number
  sort?: boolean
}

interface Row {
  data: RowData
  top: number
  height: number
}

type SortDirection = 'up' | 'down' | undefined

interface HeaderCellProps {
  column: Column
  sortDirection?: SortDirection,
  onSort: (sort: SortDirection) => void
}

const HeaderCell = ({ column: { key, title, width, sort }, sortDirection, onSort }: HeaderCellProps) => {
  const handleSort = () => {
    onSort((sortDirection === 'up') ? 'down' : (sortDirection === 'down') ? undefined : 'up');
  };

  return (
    <TableCell
      sx={{
        width,
        maxWidth: width,
        flex: width === undefined ? 1 : 0,
        flexShrink: 0,
        padding: 0,
        cursor: 'pointer'
      }}
    >
      <Box sx={{ display: 'flex' }} onClick={sort ? handleSort : undefined}>
        <Box
          sx={{
            flex: 1,
            padding: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            WebkitUserSelect: 'none'
          }}>
          {title || key}
        </Box>
        {sort && sortDirection && (
          <IconButton size='small'>
            {(sortDirection === 'up' && (
              <UpIcon />
            )) || (
              <Downicon />
            )}
          </IconButton>
        )}
      </Box>
    </TableCell>
  );
};

const rowHeight = 42;
const defaultRowKey = ({ i }: { i: number }) => String(i);
const defaultRowHeight = () => rowHeight;
const defaultValue = (data: RowData, key: string) => String(data[key]);

interface VirtualTableProps<T> {
  rows?: T[]
  selected?: string[]
  onSelect?: (selected: string[]) => void
  columns: Column[]
  getRowKey: ({ row, i }: { row: any, i: number }) => string
  getRowHeight?: ({ row, i }: { row: any, i: number }) => number
  getValue?: (data: RowData, key: string) => any
  renderRow?: ({ key, row }: { key: string, row: any }) => React.ReactNode
}

// TODO(burdon): Expand row/custom render
// TODO(burdon): Side/bottom master/detail
// TODO(burdon): Column filter
// TODO(burdon): Request more data callback
// TODO(burdon): Paging (vs. virtual scroll).
export const VirtualTable = <T extends RowData> (
  {
    rows: dataRows = [],
    selected: controlledSelected = [],
    onSelect,
    columns = [],
    getRowKey = defaultRowKey,
    getRowHeight = defaultRowHeight,
    getValue = defaultValue
  }: VirtualTableProps<T>
) => {
  //
  // Sorting.
  //
  const [{ sortKey, sortDirection }, setSort] = useState<{ sortKey?: string, sortDirection?: SortDirection }>({});
  const handleSort = (sortKey: string, sortDirection: SortDirection) => setSort({ sortKey, sortDirection });

  //
  // Cache posiions (from height) when data updated.
  //
  const [{ height, sortedRows }, setProps] = useState<{ height: number, sortedRows: Row[] }>({ height: 0, sortedRows: [] });
  useEffect(() => {
    // Sort.
    const rows = [...dataRows];
    if (sortKey && sortDirection) {
      rows.sort((v1: RowData, v2: RowData) => {
        const d1 = getValue(v1, sortKey);
        const d2 = getValue(v2, sortKey);
        return (d1 < d2 ? -1 : d1 > d2 ? 1 : 0) * (sortDirection === 'up' ? 1 : -1);
      });
    }

    // Do layout.
    const sortedRows: Row[] = [];
    const height = rows.reduce((h, row, i) => {
      const rowHeight = getRowHeight({ i, row });
      sortedRows.push({ data: row, top: h, height: rowHeight });
      return h + rowHeight;
    }, 0);

    setProps({ height, sortedRows });
  }, [dataRows, sortKey, sortDirection]);

  //
  // Set visible range.
  //
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollState] = useScrollHandler(scrollContainerRef);
  const [range, setRange] = useState<{ start: number, end: number, rows: Row[] }>({ start: 0, end: 0, rows: [] });
  useEffect(() => {
    const { clientHeight, scrollTop } = scrollState;

    let start = 0;
    let end = 0;
    sortedRows.forEach(({ top }, i) => {
      if (scrollTop > top) {
        start = i;
      } else if ((scrollTop + clientHeight) > top) {
        end = i;
      }
    });

    // TODO(burdon): Configure num rows before/after that are rendered.
    setRange({ start, end, rows: sortedRows.slice(start, end + 1) });
  }, [sortedRows, scrollState]);

  //
  // Selection
  // TODO(burdon): Options for single select and toggle select.
  //
  const [selectedController, setSelectedControlled] = useState<string[]>([]);
  useEffect(() => setSelectedControlled(controlledSelected), [controlledSelected]);
  const handleSelect = (selected: string) => {
    if (onSelect) {
      onSelect([selected]);
    } else {
      setSelectedControlled([selected]);
    }
  };

  const TableFooter = () => (
    <Box
      sx={{
        display: 'flex',
        flexShrink: 0,
        justifyContent: 'center'
      }}
    >
      {`${dataRows.length} rows`}
    </Box>
  );

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        overflow: 'hidden'
      }}
    >
      <TableContainer
        ref={scrollContainerRef}
        sx={{
          height: '100%'
        }}
      >
        <Table
          stickyHeader
        >
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <HeaderCell
                  key={column.key}
                  column={column}
                  sortDirection={sortKey === column.key ? sortDirection : undefined}
                  onSort={sortDirection => handleSort(column.key, sortDirection)}
                />
              ))}
            </TableRow>
          </TableHead>
          <TableBody
            sx={{
              position: 'relative',
              height: height
            }}
          >
            {range.rows.map(({ data, top, height }, i) => {
              const key = getRowKey({ i, row: data });
              return (
                <TableRow
                  key={key}
                  sx={{
                    display: 'flex',
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top,
                    backgroundColor: selectedController.find(s => s === key) ? 'salmon' : undefined
                  }}
                  onClick={() => handleSelect(key)}
                >
                  {columns.map(({ key, width }) => (
                    <TableCell
                      key={key}
                      sx={{
                        minWidth: width,
                        flex: width === undefined ? 1 : 0,
                        flexShrink: 0,
                        height: height,
                        padding: 1,
                        border: 'none',
                        borderBottom: 'none'
                      }}
                    >
                      {getValue(data, key)}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <TableFooter />
    </Box>
  );
};
