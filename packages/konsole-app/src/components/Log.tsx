//
// Copyright 2021 DXOS.org
//

import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';
import { AutoSizer, Column, Table } from 'react-virtualized';

import { colors, InputLabel, MenuItem, Select, TableCell } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { logLevels, IFilter, ILogMessage } from '../logging';

interface LevelColorMap {
  [key: string]: string
}

const levelColors: LevelColorMap = {
  INFO: colors.blue[500],
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
  },
  label: {
    paddingBottom: 4
  }
}));

interface LogProperties {
  messages: ILogMessage[]
}

/**
 * Table header.
 */
const Header = ({ dataKey, label, headerHeight, filterKey, filterValue, onFilterChange, Component }: {
  dataKey: string,
  label: string | React.ReactNode,
  headerHeight?: number,
  filterKey?: string,
  filterValue?: any,
  onFilterChange: (filterKey: keyof ILogMessage, filterValue: any) => void,
  Component: any
}) => {
  const classes = useStyles();

  const handleFilterChange = (value: any) => {
    onFilterChange(dataKey as keyof ILogMessage, value);
  };

  return (
    <TableCell
      component='div'
      style={{ height: headerHeight }}
      className={clsx(classes.flexContainer, classes.tableCell, classes.headerCell)}
    >
      {(Component && (
        <Component
          label={label}
          value={dataKey === filterKey ? filterValue : undefined}
          onChange={handleFilterChange}
        />
      )) || (
        <InputLabel>
          {label}
        </InputLabel>
      )}
    </TableCell>
  );
};

const LevelFilter = ({ label, value = '', onChange }: {
  label: string,
  value: any,
  onChange: (value: string) => void
}) => {
  const classes = useStyles();

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    onChange(event.target.value as string);
  };

  return (
    <div>
      <InputLabel id='label-header-level' className={classes.label}>
        {label}
      </InputLabel>
      <Select
        labelId='label-header-level'
        value={value || ''}
        onChange={handleChange}
        autoWidth
      >
        <MenuItem value=''>
          <em>All</em>
        </MenuItem>
        {logLevels.map(level => (
          <MenuItem key={level} value={level}>{level}</MenuItem>
        ))}
      </Select>
    </div>
  );
};

/**
 * Table cell.
 */
const Cell = ({ dataKey, data, rowData, rowHeight }: {
  dataKey: string,
  data: string | React.ReactNode,
  rowData: any,
  rowHeight?: number
}) => {
  const classes = useStyles();

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

const headerHeight = 60;
const rowHeight = 28;
const lineHeight = 22;

/**
 * Log table.
 */
export const Log = ({ messages }: LogProperties) => {
  const classes = useStyles();
  const tableRef = useRef<Table>(null);
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

  const handleFilterChange = (filterKey: keyof ILogMessage, filterValue: any) => {
    setFilter({ filterKey, filterValue });
  };

  // https://material-ui.com/components/tables/#virtualized-table
  // https://github.com/bvaughn/react-virtualized/blob/master/docs/Table.md

  return (
    <div className={classes.root} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <div style={{ display: 'flex', flexDirection: 'column', flex: '1 1 auto' }}>
        <AutoSizer>
          {({ width, height }) => (
            <Table
              ref={tableRef}
              // disableHeader
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
                  headerRenderer={({ label, ...other }) => (
                    <Header
                      filterKey={filterKey}
                      filterValue={filterValue}
                      onFilterChange={handleFilterChange}
                      Component={dataKey === 'level' ? LevelFilter : undefined}
                      label={label}
                      {...other}
                    />
                  )}
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
