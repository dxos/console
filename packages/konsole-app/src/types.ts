//
// Copyright 2021 DXOS.org
//


import { ComponentType } from 'react';

import { CID } from '@dxos/registry-api';

export interface IRecordType {
  type: CID
  label: string
}

export interface IRecord {
  cid: string
  created?: string
  name: string
  type: string // TODO(burdon): ???
  title?: string
  url?: string
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
  path: string
  label: string
  component: ComponentType
  icon?: ComponentType
}
