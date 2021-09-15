//
// Copyright 2021 DXOS.org
//

import {
  Reorder as LoggingIcon,
  Settings as SettingsIcon,
  Storage as ServicesIcon,
  DynamicFeed as RecordsIcon
} from '@material-ui/icons';

import { ConfigPanel } from './ConfigPanel';
import { LoggingPanel } from './LoggingPanel';
import { RecordPanel } from './RecordPanel';
import { ServicesPanel } from './ServicesPanel';
import { IPanel } from './types';

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
    component: LoggingPanel,
    icon: LoggingIcon
  },
  {
    path: '/config',
    label: 'Config',
    component: ConfigPanel,
    icon: SettingsIcon
  }
];
