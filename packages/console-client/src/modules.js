//
// Copyright 2020 DxOS
//

import AppsIcon from '@material-ui/icons/Apps';
import BotsIcon from '@material-ui/icons/Android';
import StatsIcon from '@material-ui/icons/Equalizer';
import RegistryIcon from '@material-ui/icons/Language';
import IPFSIcon from '@material-ui/icons/GraphicEq';
import ConfigIcon from '@material-ui/icons/Settings';
import SignalIcon from '@material-ui/icons/Traffic';
import ServicesIcon from '@material-ui/icons/Storage';

export default {
  services: [
    {
      path: '/console/status',
      title: 'Status',
      icon: StatsIcon
    },
    {
      path: '/console/wns',
      title: 'WNS',
      icon: RegistryIcon
    },
    {
      path: '/console/apps',
      title: 'Apps',
      icon: AppsIcon
    },
    {
      path: '/console/bots',
      title: 'Bots',
      icon: BotsIcon
    },
    {
      path: '/console/signal',
      title: 'Signal Server',
      icon: SignalIcon
    },
    {
      path: '/console/ipfs',
      title: 'IPFS',
      icon: IPFSIcon
    }
  ],

  settings: [
    {
      path: '/console/metadata',
      title: 'Metadata',
      icon: ServicesIcon
    },
    {
      path: '/console/config',
      title: 'Config',
      icon: ConfigIcon
    }
  ]
};
