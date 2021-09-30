//
// Copyright 2021 DXOS.org
//

import { ComponentType } from 'react';

export interface IService {
  name: string
  type: string
  exec: string
  status: string // TODO(burdon): Change to code?
  ports?: string // TODO(burdon): Array of numbers?
  memory?: number
  cpu?: number
}

export interface IPanel {
  id: string
  path: string
  label: string
  component: ComponentType<any>
  icon?: ComponentType
}
