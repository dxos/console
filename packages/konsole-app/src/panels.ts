//
// Copyright 2021 DXOS.org
//

// https://mui.com/components/material-icons
import {
  Bolt as TypeIcon,
  Reorder as LoggingIcon,
  Settings as SettingsIcon,
  Storage as ServicesIcon,
  DynamicFeed as RecordsIcon,
  Label as ResourcesIcon,
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
  ResourcesPanel,
  ServicesPanel,
  SignalingPanel,
  TypesPanel
} from './containers';
import { paths } from './paths';
import { IPanel } from './types';

export const panels: IPanel[] = [
  {
    id: 'services',
    path: paths.services,
    label: 'Services',
    component: ServicesPanel,
    icon: ServicesIcon
  },
  {
    id: 'domains',
    path: paths.domains,
    label: 'Domains',
    component: DomainsPanel,
    icon: DomainsIcon
  },
  {
    id: 'types',
    path: paths.types,
    label: 'Types',
    component: TypesPanel,
    icon: TypeIcon
  },
  {
    id: 'resources',
    path: paths.resources,
    label: 'Resources',
    component: ResourcesPanel,
    icon: ResourcesIcon
  },
  {
    id: 'records',
    path: paths.records,
    label: 'Records',
    component: RecordsPanel,
    icon: RecordsIcon
  },
  {
    id: 'apps',
    path: paths.apps,
    label: 'Apps',
    component: AppsPanel,
    icon: AppsIcon
  },
  {
    id: 'bots',
    path: paths.bots,
    label: 'Bots',
    component: BotsPanel,
    icon: BotsIcon
  },
  {
    id: 'signaling',
    path: paths.signaling,
    label: 'Signaling',
    component: SignalingPanel,
    icon: SignalingIcon
  },
  {
    id: 'ipfs',
    path: paths.ipfs,
    label: 'IPFS',
    component: IPFSPanel,
    icon: IPFSIcon
  },
  {
    id: 'logs',
    path: paths.logs,
    label: 'Logs',
    component: LogsPanel,
    icon: LoggingIcon
  },
  {
    id: 'config',
    path: paths.config,
    label: 'Config',
    component: ConfigPanel,
    icon: SettingsIcon
  }
];
