//
// Copyright 2020 DXOS.org
//

import React from 'react';

import { List, ListItem, ListItemText } from '@material-ui/core';

import { IRecord } from '../hooks';

interface RecordsTableProperties {
  records: IRecord[]
}

/**
 * Table that displays all registry records.
 * @constructor
 */
export const RecordsTable = ({ records }: RecordsTableProperties) => {
  return (
    <List dense>
      {records.map(({ id, title }) => (
        <ListItem key={id}>
          <ListItemText primary={title} />
        </ListItem>
      ))}
    </List>
  );
};
