//
// Copyright 2021 DXOS.org
//

import {
  Bolt as TypeIcon,
  Reorder as LoggingIcon,
  Settings as SettingsIcon,
  Storage as ServicesIcon,
  DynamicFeed as RecordsIcon,
  Share as SignalingIcon,
  CloudQueue as IPFSIcon,
  Adb as BotsIcon,
  Apps as AppsIcon,
  Layers as DomainsIcon
} from '@mui/icons-material';

import {
  AppsPanel,
  BotsPanel,
  ConfigPanel,
  DomainsPanel,
  IPFSPanel,
  LogsPanel,
  RecordsPanel,
  ServicesPanel,
  SignalingPanel,
  TypesPanel
} from './containers';
import { IPanel } from './types';

export const panels: IPanel[] = [
  {
    path: '/services',
    label: 'Services',
    component: ServicesPanel,
    icon: ServicesIcon
  },
  {
    path: '/domains',
    label: 'Domains',
    component: DomainsPanel,
    icon: DomainsIcon
  },
  {
    path: '/types',
    label: 'Types',
    component: TypesPanel,
    icon: TypeIcon
  },
  {
    path: '/records',
    label: 'Records',
    component: RecordsPanel,
    icon: RecordsIcon
  },
  {
    path: '/apps',
    label: 'Apps',
    component: AppsPanel,
    icon: AppsIcon
  },
  {
    path: '/bots',
    label: 'Bots',
    component: BotsPanel,
    icon: BotsIcon
  },
  {
    path: '/signaling',
    label: 'Signaling',
    component: SignalingPanel,
    icon: SignalingIcon
  },
  {
    path: '/ipfs',
    label: 'IPFS',
    component: IPFSPanel,
    icon: IPFSIcon
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
