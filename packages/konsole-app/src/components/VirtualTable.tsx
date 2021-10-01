//
// Copyright 2021 DXOS.org
//

import { Box, Table, TableCell, TableContainer, TableBody, TableHead, TablePagination, TableRow } from '@mui/material';
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

interface Row {
  data: any
  top: number
  height: number
}

interface VirtualTableProps {
  rows?: any[]
  getRowKey: ({ row, i }: { row: any, i: number }) => string
  getRowHeight?: ({ row, i }: { row: any, i: number }) => number
  renderRow?: ({ key, row }: { key: string, row: any }) => React.ReactNode
}

const rowHeight = 42;
const defaultRowKey = ({ i }: { i: number }) => String(i);
const defaultRowHeight = () => rowHeight;

// TODO(burdon): Paging (vs. virtual scroll).
// TODO(burdon): Column defs
// TODO(burdon): Custom rendering
// TODO(burdon): Column sort
// TODO(burdon): Column filter
// TODO(burdon): Expand row
// TODO(burdon): Side/bottom master/detail
export const VirtualTable = (
  {
    rows: dataRows = [],
    getRowKey = defaultRowKey,
    getRowHeight = defaultRowHeight
  }: VirtualTableProps
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
              <TableCell>Title</TableCell>
            </TableRow>
          </TableHead>
          <TableBody
            sx={{
              position: 'relative',
              height: height
            }}
          >
            {range.rows.map(({ data, top, height }, i) => (
              <TableRow
                key={getRowKey({ i, row: data })}
                sx={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top
                }}
              >
                <TableCell
                  sx={{
                    height: height,
                    padding: 0,
                    border: 'none',
                    borderBottom: 'none'
                  }}
                >
                  {`[${i}]: ${JSON.stringify(data)}`}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box
        sx={{
          flexShrink: 0
        }}
      >
        Bottom
      </Box>
    </Box>
  );
};
