//
// Copyright 2020 DXOS.org
//

import React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';

// TODO(burdon): Fixed color?

const Icon = (props) => (
  <SvgIcon {...props} viewBox='0 0 256 256'>
    <g transform='matrix(1,0,0,1,-160,-124)'>
      <path
        d='M282.254,147.134L195.254,194.589C191.399,196.692 189,200.732 189,205.124L189,298.876C189,303.268 191.399,307.308 195.254,309.411L282.254,356.866C285.836,358.819 290.164,358.819 293.746,356.866L380.746,309.411C384.601,307.308 387,303.268 387,298.876L387,205.124C387,200.732 384.601,196.692 380.746,194.589L293.746,147.134C290.164,145.181 285.836,145.181 282.254,147.134Z'
        style={{ fill: 'none', fillRule: 'nonzero', stroke: 'rgb(0,68,121)', strokeWidth: '12px' }}
      />
      <path
        d='M288,252L216,216'
        style={{ fill: 'none', fillRule: 'nonzero', stroke: 'rgb(0,68,121)', strokeWidth: '8px', strokeLinejoin: 'round' }}
      />
      <path
        d='M216,288L288,252'
        style={{ fill: 'none', fillRule: 'nonzero', stroke: 'rgb(0,68,121)', strokeWidth: '8px', strokeLinejoin: 'round' }}
      />
      <path
        d='M360,288L288,252'
        style={{ fill: 'none', fillRule: 'nonzero', stroke: 'rgb(0,68,121)', strokeWidth: '8px', strokeLinejoin: 'round' }}
      />
      <path
        d='M360,216L288,252'
        style={{ fill: 'none', fillRule: 'nonzero', stroke: 'rgb(0,68,121)', strokeWidth: '8px', strokeLinejoin: 'round' }}
      />
    </g>
  </SvgIcon>
);

export default Icon;
