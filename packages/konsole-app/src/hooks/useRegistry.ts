//
// Copyright 2021 DXOS.org
//

import assert from 'assert';
import { createContext, useContext, useEffect, useState } from 'react';

// TODO(burdon): Rename RegistryRecord => Record, DomainInfo => Domain, etc.
// TODO(burdon): Same Query interface for resources and records?
// TODO(burdon): Resource type has a field called "id" which is a DXN. Consistent field properties (types and protobufs).
// TODO(burdon): registryClient.getTypes? getRecordTypes?
// TODO(burdon): registry-api lint errors, functions, and nested imports.
// TODO(burdon): registry-api Remove inheritance: i.e., RegistryRecordBase to more closely follow protobuf defs; normalize fields.
// TODO(burdon): regitsry-api why both TS type definitions AND protobuf schema for all of these types? AND IRecord here?
// TODO(burdon): registry-pai remove RecordKind?
// TODO(burdon): registry-api remove MockRegistryApi singleton and expose mock client.

import { DomainInfo, IQuery, IRegistryClient, RegistryTypeRecord, RegistryRecord, Resource } from '@dxos/registry-client';

export const RegistryContext = createContext<IRegistryClient | undefined>(undefined);

/**
 * Returns the configured client object.
 */
export const useRegistryClient = (): IRegistryClient => {
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
