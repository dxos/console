//
// Copyright 2020 DxOS.org
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
      path: '/status',
      title: 'Status',
      icon: StatsIcon
    },
    {
      path: '/wns',
      title: 'WNS',
      icon: RegistryIcon
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
      path: '/signal',
      title: 'Signal Server',
      icon: SignalIcon
    },
    {
      path: '/ipfs',
      title: 'IPFS',
      icon: IPFSIcon
    }
  ],

  settings: [
    {
      path: '/metadata',
      title: 'Metadata',
      icon: ServicesIcon
    },
    {
      path: '/config',
      title: 'Config',
      icon: ConfigIcon
    }
  ]
};
