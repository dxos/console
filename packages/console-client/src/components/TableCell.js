//
// Copyright 2020 DxOS
//

import React from 'react';

import MuiTableCell from '@material-ui/core/TableCell';

// TODO(burdon): Size for header.
// TODO(burdon): Standardize table.

const TableCell = ({ children, monospace = false, title, ...rest }) => (
  <MuiTableCell
    {...rest}
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

export default TableCell;
