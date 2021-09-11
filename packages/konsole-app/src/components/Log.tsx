//
// Copyright 2021 DXOS.org
//

import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';
import { AutoSizer, Column, Table } from 'react-virtualized';

import { colors, TableCell } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

export interface ILogMessage {
  timestamp: string
  delta?: number
  level: string
  message: string
}

const columns = [
  {
    dataKey: 'timestamp',
    label: 'Timestamp',
    width: 210
  },
  {
    dataKey: 'delta',
    label: 'ẟt',
    width: 60
  },
  {
    dataKey: 'level',
    label: 'Level',
    width: 80
  },
  {
    dataKey: 'message',
    label: 'Message',
    width: 400 // TODO(burdon): Expand.
  }
];

const useStyles = makeStyles(() => ({
  root: {},
  grid: {},
  table: {},
  tableRow: {
    position: 'inherit'
  },
  tableCell: {
    flex: 1,
    border: 'none',
    padding: 4
  },
  fixedWidth: {
    fontFamily: 'monospace' // TODO(burdon): Roboto mono.
  },
  flexContainer: {
    display: 'flex',
    boxSizing: 'border-box'
  },
  hidden: {
    overflow: 'hidden',
    textOverflow: 'ellipsis', // TODO(burdon): Not working.
    whiteSpace: 'nowrap'
  }
}));

interface LevelColorMap {
  [key: string]: string
}

const levelColors: LevelColorMap = {
  DEBUG: colors.grey[700],
  WARN: colors.orange[500],
  ERROR: colors.red[400]
};

const getLevelColor = (level: string) => {
  return levelColors[level] || levelColors.DEBUG;
};

export const units = {
  h: 60 * 60 * 1000,
  m: 60 * 1000,
  s: 1000,
  ms: 1
};

export const getRelativeTime = (d1: Date, d2: Date = new Date()) => {
  const elapsed = d1.valueOf() - d2.valueOf();

  let unit: keyof typeof units;
  for (unit in units) {
    if (Math.abs(elapsed) > units[unit] || unit === 'ms') {
      return Math.round(elapsed / units[unit]) + unit;
    }
  }
};

interface LogProperties {
  messages: ILogMessage[]
}

/**
 * Virtual table for logging messages.
 * @constructor
 */
// TODO(burdon): Getter/callback.
export const Log = ({ messages }: LogProperties) => {
  const classes = useStyles();
  const rowHeight = 28;

  const [expanded, setExpanded] = useState(new Set<number>());
  const [tail, setTail] = useState(true);

  const tableRef = useRef<Table>();
  useEffect(() => {
    if (tail) {
      tableRef.current!.scrollToRow(Infinity);
    }
  }, [tableRef, messages]);

  const Header = ({ label, headerHeight }: { label: string | React.ReactNode, headerHeight?: number }) => {
    return (
      <TableCell
        component='div'
        style={{ height: headerHeight }}
        className={clsx(classes.flexContainer, classes.tableCell)}
      >
        {label}
      </TableCell>
    );
  };

  const Cell = ({ dataKey, data, rowData, rowHeight }: {
    dataKey: string,
    data: string | React.ReactNode,
    rowData: any,
    rowHeight?: number
  }) => {
    const Content = ({ data }: { data: string | number }) => {
      switch (dataKey) {
        case 'timestamp': {
          return (
            <div
              className={classes.fixedWidth}
            >
              {(data as string).replace(/[TZ]/g, ' ')}
            </div>
          );
        }

        case 'delta': {
          if (!data) {
            return null;
          }

          const now = new Date(rowData.timestamp);
          const prev = new Date(now.getTime() + (data as number));

          return (
            <div
              className={classes.fixedWidth}
            >
               {getRelativeTime(prev, now)}
            </div>
          );
        }

        case 'level': {
          return (
            <div
              className={classes.fixedWidth}
              style={{ color: getLevelColor(data as string) }}
            >
              {data}
            </div>
          );
        }

        case 'message': {
          // TODO(burdon): Show expand if multi-line.
          // const lines = data.split('\n').length;
          return (
            <div>{data}</div>
          );
        }

        default: {
          return (
            <div>{data}</div>
          );
        }
      }
    };

    return (
      <TableCell
        component='div'
        variant='body'
        style={{ height: rowHeight }}
        className={clsx(classes.flexContainer, classes.tableCell, classes.hidden)}
      >
        {typeof data === 'object' ? data : <Content data={data as string} />}
      </TableCell>
    );
  };

  // https://material-ui.com/components/tables/#virtualized-table
  // https://github.com/bvaughn/react-virtualized/blob/master/docs/Table.md
  return (
    <div className={classes.root} style={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
      <div style={{ display: 'flex', flex: '1 1 auto' }}>
        <AutoSizer>
          {({ width, height }) => (
            <Table
              ref={tableRef}
              className={classes.table}
              gridClassName={classes.grid}
              width={width}
              height={height}
              headerHeight={rowHeight}
              rowClassName={() => clsx(classes.tableRow, classes.flexContainer)}
              rowCount={messages.length}
              rowGetter={({ index }) => messages[index]}
              // scrollToAlignment='end'
              // scrollToRow={Infinity}
              onScroll={({ clientHeight, scrollHeight, scrollTop }: {
                clientHeight: number,
                scrollHeight: number,
                scrollTop: number
              }) => {
                // Tail mode if scroll to bottom.
                // NOTE: CSS overflow-anchor would work (https://blog.eqrion.net/pin-to-bottom) if we could
                // inject an anchor dev as a sibling of the scroll container inside the Grid.
                setTail(scrollHeight - clientHeight === scrollTop);
              }}
              rowHeight={({ index }) => expanded.has(index) ? 5 * rowHeight : rowHeight} // TODO(burdon): Dynamic.
              onRowClick={({ index }) => {
                if (expanded.has(index)) {
                  expanded.delete(index);
                } else {
                  expanded.add(index);
                }
                setExpanded(new Set(expanded));
                tableRef.current!.forceUpdateGrid();
              }}
            >
              {columns.map(({ dataKey, label, width }) => (
                <Column
                  key={dataKey}
                  dataKey={dataKey}
                  label={label}
                  width={width}
                  className={classes.flexContainer}
                  headerRenderer={({ label, ...other }) => <Header label={label} {...other} />}
                  cellRenderer={({ cellData, ...other }) => <Cell data={cellData} {...other} />}
                />
              ))}
            </Table>
          )}
        </AutoSizer>
      </div>
    </div>
  );
};
