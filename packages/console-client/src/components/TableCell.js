//
// Copyright 2020 DxOS.org
//

import clsx from 'clsx';
import React from 'react';

import MuiTableCell from '@material-ui/core/TableCell';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  small: {
    width: 160
  }
}));

const TableCell = ({ children, size, monospace = false, title, ...rest }) => {
  const classes = useStyles();

  return (
    <MuiTableCell
      {...rest}
      className={clsx(size && classes[size])}
      style={{
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        fontFamily: monospace ? 'monospace' : 'inherit',
        fontSize: monospace ? 14 : 'inherit'
      }}
      title={title}
    >
      {children}
    </MuiTableCell>
  );
};

export default TableCell;
