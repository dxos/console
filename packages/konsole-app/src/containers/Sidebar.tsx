//
// Copyright 2020 DXOS.org
//

import React from 'react';

import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';

import { IPanel } from '../panels';

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
  return (
    <div>
      <List>
        {panels.map(({ path, label, icon: Icon }, i) => (
          <ListItem
            key={i}
            button
            selected={path === selected}
            onClick={() => onSelect(path)}
          >
            <ListItemIcon>
              <Icon />
            </ListItemIcon>
            <ListItemText
              primary={label}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
};
