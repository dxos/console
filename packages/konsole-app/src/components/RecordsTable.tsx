//
// Copyright 2020 DXOS.org
//

import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { IRecord } from '../hooks';

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

const columns: Column[] = [
  {
    id: 'type',
    label: 'Type',
    minWidth: 170,
  },
  {
    id: 'name',
    label: 'Registered names',
    minWidth: 100
  },
  {
    id: 'version',
    label: 'Version',
    minWidth: 170,
    align: 'right',
  },
  {
    id: 'display',
    label: 'Display name',
    minWidth: 170,
  },
  {
    id: 'created',
    label: 'Created',
    minWidth: 170,
    format: (value: number) => value.toFixed(2),
  },
  {
    id: 'package',
    label: 'Package',
    minWidth: 170,
  },
];

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 440,
  },
});

interface Props {
  records: IRecord[]
}

/**
 * Table that displays all registry records.
 * @constructor
 */
export const RecordsTable = ({ records }: Props) => {
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {records.map((record) => (
              <TableRow hover role="checkbox" tabIndex={-1}>
                {columns.map((column) => {
                  const value = (record as any)[column.id];
                  return (
                    <TableCell key={column.id} align={column.align}>
                      {value}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};
