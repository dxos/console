//
// Copyright 2021 DXOS.org
//

import React from 'react';

import { Box, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import {
  Apps as DefaultIcon,
} from '@mui/icons-material';

import { IPanel } from '../panels';

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
        {panels.map(({ path, label, icon: Icon = DefaultIcon }, i) => (
          <ListItem
            key={i}
            button
            selected={path === selected}
            onClick={() => onSelect && onSelect(path)}
          >
            <ListItemIcon
              sx={{
                minWidth: 38,
                color: theme => theme.palette.primary.main
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
