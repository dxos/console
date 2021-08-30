//
// Copyright 2021 DXOS.org
//

export interface IQuery {
  type?: string
  text?: string
}

export interface IRecord {
  cid: string
  created: string
  name: string
  type: string
  title: string
  url?: string
}

export interface IRecordType {
  type: string
  label: string
}

export interface IRegistryClient {
  getRecordTypes: () => Promise<IRecordType[]>;
  queryRecords: (query?: IQuery) => Promise<IRecord[]>;
}
