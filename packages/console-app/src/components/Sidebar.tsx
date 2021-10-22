//
// Copyright 2021 DXOS.org
//

import {
  Apps as DefaultIcon
} from '@mui/icons-material';
import { Box, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import React from 'react';

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
    <Box
      sx={{
        overflow: 'scroll'
      }}
    >
      <List
        sx={{
          padding: 0
        }}
      >
        {panels.map(({ id, label, icon: Icon = DefaultIcon }) => (
          <ListItem
            key={id}
            button
            selected={id === selected}
            onClick={() => onSelect && onSelect(id)}
          >
            <ListItemIcon
              sx={{
                minWidth: 38,
                color: theme => (id === selected) ? theme.palette.primary.main : theme.palette.action.disabled
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
