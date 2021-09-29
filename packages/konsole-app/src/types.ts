//
// Copyright 2021 DXOS.org
//

import { ComponentType } from 'react';

import { CID } from '@dxos/registry-api';

// TODO(burdon): Replace with registry-api RegistryRecord type.
export interface IRecordType {
  type: CID
  label: string
}

// TODO(burdon): Replace with registry-api type.
export interface IRecord {
  cid: CID
  created?: string
  name: string
  type: string // TODO(burdon): ???
  title?: string
  url?: string
  data?: any
}

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
