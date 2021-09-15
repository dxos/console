//
// Copyright 2021 DXOS.org
//

import { ComponentType } from 'react';

export interface IPanel {
  path: string
  label: string
  component: ComponentType
  icon: ComponentType
}

// TODO(burdon): Protobuf?
export interface IService {
  name: string
  type: string
  exec: string
  status: string
  ports?: string // TODO(burdon): Array of numbers?
  memory: number
  cpu: number
}
