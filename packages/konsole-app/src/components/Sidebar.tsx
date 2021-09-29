//
// Copyright 2021 DXOS.org
//

import React from 'react';

import { Box, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import {
  Apps as DefaultIcon,
} from '@mui/icons-material';

import { IPanel } from '../types';

interface SidebarProps {
  panels?: IPanel[]
  selected?: string
  onSelect?: (path: string) => void
}

/**
 * Generic sidebar panel.
 * @constructor
 */
export const Sidebar = ({ panels = [], selected, onSelect }: SidebarProps) => {
  return (
    <Box>
      <List
        sx={{
          padding: 0
        }}
      >
        {panels.map(({ id, path, label, icon: Icon = DefaultIcon }, i) => (
          <ListItem
            key={i}
            button
            selected={id === selected}
            onClick={() => onSelect && onSelect(id)}
          >
            <ListItemIcon
              sx={{
                minWidth: 38,
                color: theme => (path === selected) ? theme.palette.primary.main : theme.palette.action.disabled
              }}
            >
              <Icon />
            </ListItemIcon>
            <ListItemText
              primary={label}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};
