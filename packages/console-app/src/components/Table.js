//
// Copyright 2020 DXOS.org
//

import React from 'react';
import { makeStyles } from '@material-ui/core';
import MuiTable from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flex: 1,
    overflowY: 'scroll',
    backgroundColor: theme.palette.background.paper
  },

  table: {
    // tableLayout: 'fixed',

    '& th': {
      fontVariant: 'all-small-caps',
      fontSize: 18,
      cursor: 'ns-resize'
    }
  }
}));

const Table = ({ children }) => {
  const classes = useStyles();

  return (
    <TableContainer className={classes.root}>
      <MuiTable stickyHeader size='small' className={classes.table}>
        {children}
      </MuiTable>
    </TableContainer>
  );
};

export default Table;
