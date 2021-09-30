//
// Copyright 2021 DXOS.org
//

import assert from 'assert';
import urlJoin from 'proper-url-join';
import { createContext, useContext, useEffect, useState } from 'react';

// TODO(burdon): Consistent prefixes (e.g., IQuery vs Query)?
// TODO(burdon): Rename IRegistryApi => IRegistryClient
// TODO(burdon): Rename RegistryRecord => Record
// TODO(burdon): Rename DomainInfo => Domain
// TODO(burdon): Same Query interface for resources and records?
// TODO(burdon): Resource type has a field called "id" which is a DXN. Consistent field properties (types and protobufs).
// TODO(burdon): registryClient.getTypes? getRecordTypes?
// TODO(burdon): registry-api has lint errors, functions, and nested imports.
// TODO(burdon): registry-api has RegistryRecordBase (why?) with a cid field and in RegistryDataRecord a different CID field called type.
// TODO(burdon): regitsry-api WHY do we have TS type definitions when we have protobuf schema for all of these types? AND IRecord here?
// TODO(burdon): registry-pai WHY is RecordKind necessary.
// TODO(burdon): registry-api remove MockRegistryApi singleton.

import {
  CID, DomainInfo, IQuery, IRegistryApi, RegistryTypeRecord, RegistryRecord, Resource
} from '@dxos/registry-api';

import { IConfig } from './useConfig';

export const RegistryContext = createContext<IRegistryApi | undefined>(undefined);

// UX types.
// TODO(burdon): RecordsPanel should just show Records (no name, etc.)
// TODO(burdon): ResourcesPanel should show a join of ALL versioned records for a particular name (with links to above).

export interface IRecord {
  name: string // TODO(burdon): This isn't part of the record.

  cid: CID
  version?: string // TODO(burdon): Add.
  created?: string // TODO(burdon): Is this working?
  title?: string
  data?: any

  type?: string // TODO(burdon): What is this?
  url?: string
}

/**
 * Returns the configured client object.
 */
export const useRegistryClient = (): IRegistryApi => {
  const api = useContext(RegistryContext);
  assert(api);
  return api;
};

// TODO(burdon): Common pattern to refresh (e.g., return [data, refreshData] or subscription).

/**
 * Returns the set of domains.
 */
// TODO(burdon): Query.
export const useDomains = (): DomainInfo[] => {
  const registryClient = useRegistryClient();
  const [domains, setDomains] = useState<DomainInfo[]>([]);

  useEffect(() => {
    setImmediate(async () => {
      const domains = await registryClient.getDomains();
      setDomains(domains);
    });
  }, []);

  return domains;
};

/**
 * Returns matching record types.
 * @param query
 */
export const useRecordTypes = (query?: IQuery): RegistryTypeRecord[] => {
  const registryClient = useRegistryClient();
  const [recordTypes, setRecordTypes] = useState<RegistryTypeRecord[]>([]);

  useEffect(() => {
    setImmediate(async () => {
      const recordTypes = await registryClient.getTypes(query);
      setRecordTypes(recordTypes);
    });
  }, [query]);

  return recordTypes;
};

/**
 * Returns matching records.
 * @param query
 */
export const useRecords = (query?: IQuery): RegistryRecord[] => {
  const registryClient = useRegistryClient();
  const [records, setRecords] = useState<RegistryRecord[]>([]);

  useEffect(() => {
    setImmediate(async () => {
      const resources = await registryClient.getRecords(query);
      setRecords(resources);
    });
  }, [query]);

  return records;
};

/**
 * Returns matching resources.
 * @param query
 */
export const useResources = (query?: IQuery): Resource[] => {
  const registryClient = useRegistryClient();
  const [resources, setResources] = useState<Resource[]>([]);

  useEffect(() => {
    setImmediate(async () => {
      const resources = await registryClient.getResources(query);
      setResources(resources);
    });
  }, [query]);

  return resources;
};

/**
 * Joins resources with record types.
 * @param resources
 * @param recordTypes
 * @param config
 */
export const joinRecords = (resources: Resource[], recordTypes: RegistryTypeRecord[], config: IConfig): IRecord[] => {
  // TODO(burdon): Hack.
  const getRecordTypeString = (record: RegistryRecord, types: RegistryTypeRecord[]): string | undefined => {
    if (RegistryRecord.isDataRecord(record)) {
      const matches = types.filter(({ cid }) => cid.equals(record.type));
      if (matches.length !== 1) {
        return;
      }

      return matches[0].messageName;
    }
  };

  return resources.map(resource => {
    const record: IRecord = {
      name: resource.id.toString(),
      cid: resource.record.cid,
      // TODO(marcin): Currently registry API does not expose that. Add that to the DTO.
      created: resource.record.meta.created,
      title: resource.record.meta.name
    };

    const type = getRecordTypeString(resource.record, recordTypes);
    if (type) {
      record.type = type;
    }

    // TODO(burdon): Move to Resrouce.
    const url = (type === '.dxos.App')
      ? urlJoin(config.services.app.server, config.services.app.prefix, resource.id.toString())
      : undefined;
    if (url) {
      record.url = url;
    }

    if (RegistryRecord.isDataRecord(resource.record)) {
      record.data = resource.record.data;
    }

    return record;
  });
};
