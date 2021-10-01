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

//
// Data
//

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

//
// Header
//

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
            paddingLeft: 2,
            paddingRight: 2,
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

//
// Cell
//

export interface RenderCellProps {
  column: Column
  row: any
  key: string
  value: any
  rowSelected: boolean
  getValue: (data: RowData, key: string) => any
}

const defaultRenderCell = ({ getValue, row, key }: RenderCellProps) => (
  <div>
    {getValue(row, key)}
  </div>
);

interface DataCellProps {
  column: Column
  row: RowData
  height: number
  rowSelected: boolean
  getValue: (data: RowData, key: string) => any
  renderCell: (props: RenderCellProps) => any
}

const DataCell = ({ column, row, height, renderCell, rowSelected, getValue }: DataCellProps) => {
  const { key, width } = column;
  const value = getValue(row, key);
  const component = renderCell({ column, key, row, value, rowSelected, getValue }) ||
    defaultRenderCell({ column, key, row, value, rowSelected, getValue });

  return (
    <TableCell
      key={key}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'top',
        minWidth: width,
        flex: width === undefined ? 1 : 0,
        flexShrink: 0,
        height: height,
        padding: 1,
        paddingLeft: 2,
        paddingRight: 2,
        border: 'none',
        borderBottom: 'none',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        cursor: 'pointer',
        lineHeight: 1.5
      }}
    >
      {component}
    </TableCell>
  );
};

//
// Scroll handler
//

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

//
// Table
//

export type SelectionModel = string[]

export interface GetRowHeightProps {
  row: RowData
  i: number
  rowSelected: boolean
}

const rowHeight = 42;

const defaultRowHeight = () => rowHeight;
const defaultValue = (data: RowData, key: string) => data[key];

interface VirtualTableProps<T> {
  rows?: T[]
  selected?: SelectionModel
  onSelect?: (selected: SelectionModel) => void
  columns: Column[]
  getRowKey: (row: RowData) => string
  getRowHeight?: (props: GetRowHeightProps) => number
  getValue?: (data: RowData, key: string) => any
  renderCell?: (props: RenderCellProps) => React.ReactNode
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
    getRowKey,
    getRowHeight = defaultRowHeight,
    getValue = defaultValue,
    renderCell = defaultRenderCell
  }: VirtualTableProps<T>
) => {
  //
  // Sorting.
  //
  const [{ sortKey, sortDirection }, setSort] = useState<{ sortKey?: string, sortDirection?: SortDirection }>({});
  const handleSort = (sortKey: string, sortDirection: SortDirection) => setSort({ sortKey, sortDirection });

  //
  // Selection.
  // TODO(burdon): Scroll to same position.
  // TODO(burdon): Options for single select and toggle select.
  //
  const [selectedController, setSelectedControlled] = useState<SelectionModel>([]);
  useEffect(() => setSelectedControlled(controlledSelected), [controlledSelected]);
  const handleSelect = (selected: string) => {
    if (onSelect) {
      onSelect([selected]);
    } else {
      setSelectedControlled([selected]);
    }
  };

  //
  // Do layout and cache positions.
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
      const key = getRowKey(row);
      const rowSelected = !!selectedController.find(s => s === key);
      const rowHeight = getRowHeight({ i, row, rowSelected });
      sortedRows.push({ data: row, top: h, height: rowHeight });
      return h + rowHeight;
    }, 0);

    setProps({ height, sortedRows });
  }, [dataRows, sortKey, sortDirection, selectedController]);

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
            {range.rows.map(({ data, top, height }) => {
              const key = getRowKey(data);
              const rowSelected = !!selectedController.find(s => s === key);

              return (
                <TableRow
                  key={key}
                  selected={rowSelected}
                  sx={{
                    display: 'flex',
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top,
                    height,
                    overflow: 'hidden'
                  }}
                  onClick={() => handleSelect(key)}
                >
                  {columns.map((column) => (
                    <DataCell
                      key={column.key}
                      column={column}
                      row={data}
                      height={height}
                      getValue={getValue}
                      renderCell={renderCell}
                      rowSelected={rowSelected}
                    />
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
