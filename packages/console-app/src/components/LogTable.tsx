//
// Copyright 2021 DXOS.org
//

import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';
import { AutoSizer, Column, Table } from 'react-virtualized';
import hash from 'string-hash';

import {
  colors,
  Box,
  Divider,
  FormControl,
  FormHelperText,
  InputBase,
  MenuItem,
  Select,
  SelectChangeEvent,
  TableCell
} from '@mui/material';
import { makeStyles } from '@mui/styles';

import { IFilter, ILogMessage } from '../logging';

const LOG_COLUMN_WIDTH = 500;

// Levels

interface LevelColorMap {
  [key: string]: string
}

const levelColors: LevelColorMap = {
  INFO: colors.blue[500],
  WARN: colors.orange[500],
  ERROR: colors.red[400]
};

// const hashedColors = Object.keys(colors);
const hashedColors = [
  'red', 'purple', 'indigo', 'blue', 'cyan', 'teal', 'green', 'lime', 'amber', 'orange', 'deepOrange', 'brown'
];

const getLevelColor = (level: string): string => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return level && (levelColors[level] || colors[hashedColors[hash(level) % hashedColors.length]][500]);
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

const splitStringByLinesByWidth = (str: string, width: number) => {
  const words = str.split(' ');
  const lines = [];
  let currentLine = words[0];
  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const widthWithSpace = currentLine.length + word.length + 1;
    if (widthWithSpace > width) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine += ` ${word}`;
    }
  }
  lines.push(currentLine);
  return lines;
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
    width: 260,
    flexShrink: 0
  },
  {
    dataKey: 'message',
    label: 'Message',
    width: LOG_COLUMN_WIDTH, // TODO(burdon): Causes error if not provided, but otherwise disables flex.
    flexShrink: 1,
    flexGrow: 1
  }
];

// TODO(burdon): Update gem to use Mui5 (remove dependency on @mui/styles).
const useStyles = makeStyles(() => ({
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
    fontSize: 16
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

interface IContext {
  levels: string[]
}

/**
 * Table header.
 */
const Header = ({ dataKey, label, headerHeight, filterKey, filterValue, onFilterChange, context, Component }: {
  dataKey: string,
  label: string | React.ReactNode,
  headerHeight?: number,
  filterKey?: string,
  filterValue?: any,
  onFilterChange: (filterKey: keyof ILogMessage, filterValue: any) => void,
  context: IContext,
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
          context={context}
          label={label}
          value={dataKey === filterKey ? filterValue : undefined}
          onChange={handleFilterChange}
        />
      )) || (
        <div>
          <InputBase style={{ visibility: 'hidden' }} />
          <FormHelperText>{label}</FormHelperText>
        </div>
      )}
    </TableCell>
  );
};

const LevelFilter = ({ context, label, value = '', onChange }: {
  context: IContext,
  label: string,
  value: any,
  onChange: (value: string) => void
}) => {
  const { levels } = context;

  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value as string);
  };

  // TODO(burdon): Support multi-select.
  return (
    <FormControl variant='standard'>
      <Select
        displayEmpty
        value={value || ''}
        onChange={handleChange}
        sx={{
          fontFamily: 'DM Mono, monospace',
          fontSize: 16
        }}
      >
        <MenuItem value=''>ALL</MenuItem>
        <Divider />
        {levels.map(level => (
          <MenuItem key={level} value={level}>{level}</MenuItem>
        ))}
      </Select>
      <FormHelperText>{ label }</FormHelperText>
    </FormControl>
  );
};

/**
 * Table cell.
 */
const Cell = ({ dataKey, data, rowData, rowHeight, width }: {
  dataKey: string,
  data: string | React.ReactNode,
  rowData: any,
  rowHeight?: number
  width: number
}) => {
  const classes = useStyles();

  const Content = ({ data }: { data: string | number }) => {
    switch (dataKey) {
      // TODO(burdon): Trim TS to 3 digit ms.
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
          <div>
            <div
              className={classes.fixedWidth}
              style={{ color: getLevelColor(data as string) }}
            >
              {data}
            </div>
          </div>
        );
      }

      case 'message': {
        let lines = (data as string).split('\n');
        if (lines.length === 1) {
          lines = splitStringByLinesByWidth(data as string, Math.ceil(width / 10));
        }
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

interface LogProps {
  messages?: ILogMessage[]
}

/**
 * Log table.
 */
export const LogTable = ({ messages = [] }: LogProps) => {
  const classes = useStyles();
  const tableRef = useRef<Table>(null);
  const [filteredMessages, setFilteredMessages] = useState(messages);
  const [levels, setLevels] = useState<string[]>([]);
  const [{ filterKey, filterValue }, setFilter] = useState<IFilter>({ filterKey: undefined, filterValue: undefined });
  const [tail, setTail] = useState(true);
  const [logsColumnWidth, setlogsColumnWidth] = useState(0);

  // Filter.
  useEffect(() => {
    const levels = messages.reduce((values, message) => {
      if (message.level) {
        values.add(message.level);
      }
      return values;
    }, new Set<string>());
    setLevels(Array.from(levels));

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

  // Recalculate height.
  useEffect(() => {
    // Recalculate height.
    tableRef.current!.recomputeRowHeights(); // Refresh.
  }, [filteredMessages, logsColumnWidth]);

  const handleFilterChange = (filterKey: keyof ILogMessage, filterValue: any) => {
    setFilter({ filterKey, filterValue });
  };

  // TODO(burdon): Replace with https://github.com/bvaughn/react-window or https://react-table.tanstack.com (merge with react-components efforts).
  // https://mui.com/components/tables/#virtualized-table
  // https://github.com/bvaughn/react-virtualized/blob/master/docs/Table.md

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', flex: '1 1 auto' }}>
        <AutoSizer>
          {({ width: tableWidth, height }) => {
            const logColumnWidth = Math.max(columns.filter(col => col.dataKey !== 'message').reduce((sum, col) => sum - col.width, tableWidth), LOG_COLUMN_WIDTH);
            setlogsColumnWidth(logColumnWidth);
            return (
              <Table
                ref={tableRef}
                width={tableWidth}
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
                  // Tail mode (pinned) if scrolled to bottom.
                  // NOTE: CSS overflow-anchor would work (https://blog.eqrion.net/pin-to-bottom) if we could
                  // inject an anchor dev as a sibling of the scroll container inside the Grid.
                  setTail(scrollHeight - clientHeight === scrollTop);
                }}
                rowHeight={({ index }: { index: number }) => {
                  const message = filteredMessages[index];
                  let lines = message.message.split('\n').length;
                  if (lines === 1) {
                    lines = splitStringByLinesByWidth(message.message, Math.ceil(logColumnWidth / 10)).length;
                  }
                  // Expand all logs by default.
                  return rowHeight + (lines - 1) * lineHeight;
                }}
              >
                {
                  columns.map(({ dataKey, label, width }) => {
                    const columnWidth = (dataKey === 'message') ? logColumnWidth : width;
                    return (
                      <Column
                        key={dataKey}
                        dataKey={dataKey}
                        label={label}
                        width={columnWidth}
                        className={classes.flexContainer}
                        headerRenderer={({ label, ...other }) => (
                          <Header
                            filterKey={filterKey}
                            filterValue={filterValue}
                            onFilterChange={handleFilterChange}
                            Component={dataKey === 'level' ? LevelFilter : undefined}
                            context={{ levels }}
                            label={label}
                            {...other}
                          />
                        )}
                        cellRenderer={({ cellData, ...other }) => <Cell data={cellData} width={columnWidth} {...other} />}
                      />
                    );
                  })
                }
              </Table>
            );
          }
          }
        </AutoSizer>
      </Box>
    </Box>
  );
};
