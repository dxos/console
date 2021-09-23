//
// Copyright 2020 DXOS.org
//

import React from 'react';

import { Passcode } from '../src';

export default {
  title: 'Passcode'
};

export const Primary = () => {
  return (
    <Passcode
      editable={true}
      length={6}
      attempt={1}
      onSubmit={() => {}}
    />
  );
};
