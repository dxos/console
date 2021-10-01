//
// Copyright 2021 DXOS.org
//

import { Box, Table, TableCell, TableContainer, TableBody, TableHead, TableRow } from '@mui/material';
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
}

interface Row {
  data: RowData
  top: number
  height: number
}

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

// TODO(burdon): Column sort
// TODO(burdon): Expand row
// TODO(burdon): Custom rendering
// TODO(burdon): Column filter
// TODO(burdon): Side/bottom master/detail
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
  // Cache posiions (from height) when data updated.
  //
  const [{ height, layout }, setProps] = useState<{ height: number, layout: Row[] }>({ height: 0, layout: [] });
  useEffect(() => {
    const layout: Row[] = [];
    const height = dataRows.reduce((h, row, i) => {
      const rowHeight = getRowHeight({ i, row });
      layout.push({ data: row, top: h, height: rowHeight });
      return h + rowHeight;
    }, 0);

    setProps({ height, layout });
  }, [dataRows]);

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
    layout.forEach(({ top }, i) => {
      if (scrollTop > top) {
        start = i;
      } else if ((scrollTop + clientHeight) > top) {
        end = i;
      }
    });

    // TODO(burdon): Configure num rows before/after that are rendered.
    setRange({ start, end, rows: layout.slice(start, end + 1) });
  }, [layout, scrollState]);

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
              {columns.map(({ key, title, width }) => (
                <TableCell
                  key={key}
                  sx={{
                    width,
                    flex: width === undefined ? 1 : 0,
                    flexShrink: 0,
                    padding: 1
                  }}
                >
                  {title || key}
                </TableCell>
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
