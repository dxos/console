//
// Copyright 2021 DXOS.org
//

import urlJoin from 'proper-url-join';
import { useEffect, useState } from 'react';

import { IQuery, RegistryRecord, Resource } from '@dxos/registry-api';

import { IRecord, IRecordType } from '../types';
import { IConfig } from './useConfig';
import { useRegistryClient } from './useRegistry';

/**
 *
 */
export const getRecordTypeString = (resource: Resource, types: IRecordType[]): string | undefined => {
  const record = resource.record;
  if (RegistryRecord.isTypeRecord(record)) {
    return 'type'; // TODO(burdon): Const from protobuf?
  } else if (RegistryRecord.isDataRecord(record)) {
    const matches = types.filter(({ type }) => type.equals(record.type));
    if (matches.length !== 1) {
      return;
    }

    return matches[0].label;
  }
};

// TODO(burdon): Comment.
export const mapRecords = (resources: Resource[], recordTypes: IRecordType[], config: IConfig): IRecord[] => {
  return resources.map(resource => {
    const type = getRecordTypeString(resource, recordTypes);

    // TODO(burdon): App type const?
    const url = (type === '.dxos.App')
      ? urlJoin(config.services.app.server, config.services.app.prefix, resource.id.toString())
      : undefined;

    const result: IRecord = {
      cid: resource.record.cid.toB58String(),
      // TODO(marcin): Currently registry API does not expose that. Add that to the DTO.
      created: resource.record.meta.created,
      name: resource.id.toString(),
      type: type || '', // TODO(burdon): ???
      title: resource.record.meta.name
    };

    if (url) {
      result.url = url;
    }

    if (RegistryRecord.isDataRecord(resource.record)) {
      result.data = resource.record.data;
    }

    return result;
  });
};

export const useResources = (query?: IQuery): Resource[] => {
  const [resources, setResources] = useState<Resource[]>([]);
  const registryClient = useRegistryClient();

  useEffect(() => {
    setImmediate(async () => {
      const resources = await registryClient.getResources(query);
      setResources(resources);
    });
  }, [query]);

  return resources;
};
