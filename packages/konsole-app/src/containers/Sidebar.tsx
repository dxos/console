//
// Copyright 2020 DXOS.org
//

import React from 'react';
import { List, ListItem, ListItemText } from '@material-ui/core';

export interface IPanel {
  label: string
  component: object
}

interface SidebarProperties {
  panels: IPanel[]
}

/**
 * Generic sidebar panel.
 * @constructor
 */
export const Sidebar = ({ panels }: SidebarProperties) => {
  return (
    <div>
      <List>
        {panels.map(({ label }, i) => (
          <ListItem key={i} button>
            <ListItemText
              primary={label}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
};
