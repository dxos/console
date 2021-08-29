//
// Copyright 2021 DXOS.org
//

import { ComponentType } from 'react';

import { ConfigPanel } from './ConfigPanel';
import { NetworkPanel } from './NetworkPanel';
import { RecordPanel } from './RecordPanel';

export interface IPanel {
  path: string
  label: string
  component: ComponentType
  icon: ComponentType
}

export const panelConfig: IPanel[] = [
  {
    path: '/records',
    label: 'Records',
    component: RecordPanel,
    icon: RecordPanel.Icon
  },
  {
    path: '/network',
    label: 'Network',
    component: NetworkPanel,
    icon: NetworkPanel.Icon
  },
  {
    path: '/config',
    label: 'Config',
    component: ConfigPanel,
    icon: ConfigPanel.Icon
  }
];
