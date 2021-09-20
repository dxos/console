//
// Copyright 2021 DXOS.org
//

import { ComponentType } from 'react';

import {
  Reorder as LoggingIcon,
  Settings as SettingsIcon,
  Storage as ServicesIcon,
  DynamicFeed as RecordsIcon
} from '@mui/icons-material';

import {
  ConfigPanel,
  LogsPanel,
  RecordPanel,
  ServicesPanel
} from './containers';

export interface IPanel {
  path: string
  label: string
  component: ComponentType
  icon?: ComponentType
}

export const panels: IPanel[] = [
  {
    path: '/services',
    label: 'Services',
    component: ServicesPanel,
    icon: ServicesIcon
  },
  {
    path: '/records',
    label: 'Records',
    component: RecordPanel,
    icon: RecordsIcon
  },
  {
    path: '/logs',
    label: 'Logs',
    component: LogsPanel,
    icon: LoggingIcon
  },
  {
    path: '/config',
    label: 'Config',
    component: ConfigPanel,
    icon: SettingsIcon
  }
];
