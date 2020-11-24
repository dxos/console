//
// Copyright 2020 DXOS.org
//

import AppsIcon from '@material-ui/icons/Apps';
import BotsIcon from '@material-ui/icons/Android';
import StatsIcon from '@material-ui/icons/Equalizer';
import RegistryIcon from '@material-ui/icons/Language';
import IPFSIcon from '@material-ui/icons/GraphicEq';
import ConfigIcon from '@material-ui/icons/Settings';
import SignalIcon from '@material-ui/icons/Traffic';
import KubeIcon from '@material-ui/icons/Dns';

/**
 * Paths should match Main routes.
 */
export default {
  services: [
    {
      path: '/system',
      title: 'System',
      icon: StatsIcon
    },
    {
      path: '/registry',
      title: 'Registry',
      icon: RegistryIcon
    },
    {
      path: '/kubes',
      title: 'KUBE Nodes',
      icon: KubeIcon
    },
    {
      path: '/apps',
      title: 'Apps',
      icon: AppsIcon
    },
    {
      path: '/bots',
      title: 'Bots',
      icon: BotsIcon
    },
    {
      path: '/signaling',
      title: 'Signaling',
      icon: SignalIcon
    },
    {
      path: '/ipfs',
      title: 'IPFS',
      icon: IPFSIcon
    },
    {
      path: '/sentry',
      title: 'Sentry',
      icon: StatsIcon
    }
  ],

  settings: [
    {
      path: '/config',
      title: 'Config',
      icon: ConfigIcon
    }
  ]
};
