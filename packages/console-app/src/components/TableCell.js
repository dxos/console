//
// Copyright 2020 DXOS.org
//

import clsx from 'clsx';
import React from 'react';

import MuiTableCell from '@material-ui/core/TableCell';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  icon: {
    width: 48
  },
  small: {
    width: 130
  },
  medium: {
    width: 170
  },
  large: {
    width: 400
  }
}));

const TableCell = ({ children, size, monospace = false, ellipsis = false, style, title, ...rest }) => {
  const classes = useStyles();

  return (
    <MuiTableCell
      {...rest}
      className={clsx(size && classes[size])}
      style={{
        overflow: 'hidden',
        textOverflow: ellipsis ? 'ellipsis' : '',
        whiteSpace: 'nowrap',
        verticalAlign: 'top',
        fontFamily: monospace ? 'monospace' : 'inherit',
        fontSize: monospace ? 14 : 13,
        ...style
      }}
      title={title}
    >
      {children}
    </MuiTableCell>
  );
};

export default TableCell;
