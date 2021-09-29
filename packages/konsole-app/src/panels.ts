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
    id: 'services',
    path: '/services',
    label: 'Services',
    component: ServicesPanel,
    icon: ServicesIcon
  },
  {
    id: 'domains',
    path: '/domains',
    label: 'Domains',
    component: DomainsPanel,
    icon: DomainsIcon
  },
  {
    id: 'types',
    path: '/types',
    label: 'Types',
    component: TypesPanel,
    icon: TypeIcon
  },
  {
    id: 'records',
    path: '/records/:cid?',
    label: 'Records',
    component: RecordsPanel,
    icon: RecordsIcon
  },
  {
    id: 'apps',
    path: '/apps',
    label: 'Apps',
    component: AppsPanel,
    icon: AppsIcon
  },
  {
    id: 'bots',
    path: '/bots',
    label: 'Bots',
    component: BotsPanel,
    icon: BotsIcon
  },
  {
    id: 'signaling',
    path: '/signaling',
    label: 'Signaling',
    component: SignalingPanel,
    icon: SignalingIcon
  },
  {
    id: 'ipfs',
    path: '/ipfs',
    label: 'IPFS',
    component: IPFSPanel,
    icon: IPFSIcon
  },
  {
    id: 'logs',
    path: '/logs',
    label: 'Logs',
    component: LogsPanel,
    icon: LoggingIcon
  },
  {
    id: 'config',
    path: '/config',
    label: 'Config',
    component: ConfigPanel,
    icon: SettingsIcon
  }
];
