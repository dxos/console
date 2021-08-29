//
// Copyright 2020 DXOS.org
//

import { ComponentType } from 'react';

import {
  Settings as SettingsIcon,
  ViewList as RecordsIcon
} from '@material-ui/icons';

import { ConfigPanel } from './ConfigPanel';
import { RecordPanel } from './RecordPanel';

export * from './ConfigPanel';
export * from './RecordPanel';

export interface IPanel {
  path: string
  label: string
  component: ComponentType
  icon: ComponentType
}

export const panels: IPanel[] = [
  {
    path: '/records',
    label: 'Records',
    component: RecordPanel,
    icon: RecordsIcon
  },
  {
    path: '/config',
    label: 'Config',
    component: ConfigPanel,
    icon: SettingsIcon
  }
];
