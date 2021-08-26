//
// Copyright 2020 DXOS.org
//

import React, { ComponentType } from 'react';
import { List, ListItem, ListItemText } from '@material-ui/core';

export interface IPanel {
  path: string
  label: string
  component: ComponentType
}

interface SidebarProperties {
  panels: IPanel[]
  selected: string | undefined
  onSelect: (path: string) => void
}

/**
 * Generic sidebar panel.
 * @constructor
 */
export const Sidebar = ({ panels, selected, onSelect }: SidebarProperties) => {

  console.log('::::', selected);

  return (
    <div>
      <List>
        {panels.map(({ path, label }, i) => (
          <ListItem
            key={i}
            button
            selected={path === selected}
            onClick={() => onSelect(path)}
          >
            <ListItemText
              primary={label}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
};
