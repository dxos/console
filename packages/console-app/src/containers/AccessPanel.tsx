//
// Copyright 2021 DXOS.org
//

import React from 'react';

import { Panel } from '../components';
import { useQR } from '../hooks';

/**
 * Displays OTP QR Code.
 */
export const AccessPanel = () => {
  const [qr] = useQR();
  return (
    <Panel>
        <div>{qr?.imageSrc && <img src={qr.imageSrc} />}</div>
    </Panel>
  );
};
