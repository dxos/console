//
// Copyright 2021 DXOS.org
//

import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';
import { AutoSizer, Column, Table } from 'react-virtualized';

import { colors, InputLabel, MenuItem, Select, TableCell } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

// Data types

export interface ILogMessage {
  timestamp: string
  delta?: number
  level: string
  message: string
}

interface IFilter {
  filterKey: keyof ILogMessage | undefined
  filterValue: string | undefined
}

// Levels

const levels = [
  'DEBUG', 'WARN', 'ERROR'
];

interface LevelColorMap {
  [key: string]: string
}

const levelColors: LevelColorMap = {
  WARN: colors.orange[500],
  ERROR: colors.red[400]
};

const getLevelColor = (level: string) => {
  return levelColors[level];
};

// Time

export const units = {
  h: 60 * 60 * 1000,
  m: 60 * 1000,
  s: 1000,
  ms: 1
};

const getRelativeTime = (d1: Date, d2: Date = new Date()) => {
  const elapsed = d1.valueOf() - d2.valueOf();

  let unit: keyof typeof units;
  for (unit in units) {
    if (Math.abs(elapsed) > units[unit] || unit === 'ms') {
      return Math.round(elapsed / units[unit]) + unit;
    }
  }
};

const columns = [
  {
    dataKey: 'timestamp',
    label: 'Timestamp',
    width: 230,
    flexShrink: 0
  },
  {
    dataKey: 'delta',
    label: 'ẟt',
    width: 80,
    flexShrink: 0
  },
  {
    dataKey: 'level',
    label: 'Level',
    width: 80,
    flexShrink: 0
  },
  {
    dataKey: 'message',
    label: 'Message',
    width: 500, // TODO(burdon): Causes error if not provided, but otherwise disables flex.
    flexShrink: 1,
    flexGrow: 1
  }
];

const useStyles = makeStyles(() => ({
  root: {},
  grid: {},
  table: {},
  headerCell: {
    flexDirection: 'column'
  },
  tableRow: {
    position: 'inherit'
  },
  tableCell: {
    flex: 1,
    border: 'none',
    padding: 4,
    cursor: 'pointer',
    fontFamily: 'DM Sans, sans-serif',
    fontSize: 16
  },
  fixedWidth: {
    fontFamily: 'DM Mono, monospace',
    fontSize: 15
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

interface LogProperties {
  messages: ILogMessage[]
}

/**
 * Virtual table for logging messages.
 * @constructor
 */
export const Log = ({ messages }: LogProperties) => {
  const classes = useStyles();
  const headerHeight = 60;
  const rowHeight = 28;
  const lineHeight = 22;

  const tableRef = useRef<Table>();
  const [filteredMessages, setFilteredMessages] = useState(messages);
  const [expanded, setExpanded] = useState(new Set<number>()); // TODO(burdon): Should not be by index. Need unique ID.
  const [{ filterKey, filterValue }, setFilter] = useState<IFilter>({ filterKey: undefined, filterValue: undefined });
  const [tail, setTail] = useState(true);

  // Filter.
  useEffect(() => {
    if (filterKey && filterValue) {
      setFilteredMessages(messages.filter(message => {
        return message[filterKey as keyof ILogMessage] === filterValue;
      }));
    } else {
      setFilteredMessages(messages);
    }
  }, [messages, filterKey, filterValue]);

  // Auto scroll if pinned.
  useEffect(() => {
    if (tail) {
      tableRef.current!.scrollToRow(Infinity);
    }
  }, [filteredMessages]);

  const handleFilterChange = (dataKey: keyof ILogMessage) => (event: React.ChangeEvent<{ value: unknown }>) => {
    setFilter({
      filterKey: dataKey,
      filterValue: event.target.value as string
    });
  };

  const Header = ({ dataKey, label, headerHeight }: {
    dataKey: string,
    label: string | React.ReactNode,
    headerHeight?: number
  }) => {
    const Filter = () => {
      switch (dataKey) {
        case 'level': {
          // TODO(burdon): Closed on repaint; probably need to move outside of Grid.
          // TODO(burdon): Multi select: https://material-ui.com/components/selects/#multiple-select
          return (
            <>
              <InputLabel shrink id='label-header-level'>
                {label}
              </InputLabel>
              <Select
                labelId='label-header-level'
                onChange={handleFilterChange(dataKey)}
                value={filterKey === dataKey ? filterValue : undefined}
              >
                <MenuItem>
                  <em>None</em>
                </MenuItem>
                {levels.map(level => (
                  <MenuItem key={level} value={level}>{level}</MenuItem>
                ))}
              </Select>
            </>
          );
        }

        default:
          return (
            <InputLabel shrink>
              {label}
            </InputLabel>
          );
      }
    };

    return (
      <TableCell
        component='div'
        style={{ height: headerHeight }}
        className={clsx(classes.flexContainer, classes.tableCell, classes.headerCell)}
      >
        <Filter />
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
              style={{ color: colors.green[500] }}
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
          const lines = (data as string).split('\n');
          return (
            <div>{lines.map((line, i) => <div key={i}>{line}</div>)}</div>
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
              headerHeight={headerHeight}
              rowClassName={() => clsx(classes.tableRow, classes.flexContainer)}
              rowCount={filteredMessages.length}
              rowGetter={({ index }) => filteredMessages[index]}
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
              rowHeight={({ index }: { index: number }) => {
                const message = messages[index].message;
                const lines = message.split('\n').length;
                return rowHeight + (expanded.has(index) ? (lines - 1) * lineHeight : 0);
              }}
              onRowClick={({ index }: { index: number }) => {
                if (expanded.has(index)) {
                  expanded.delete(index);
                } else {
                  expanded.add(index);
                }
                setExpanded(new Set(expanded));
                tableRef.current!.Grid.recomputeGridSize();
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
