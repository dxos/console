//
// Copyright 2020 DXOS.org
//

// TODO(burdon): Protocol buffer definition?
export interface IRecord {
  id: string
  title: string
  type: string
  name: string
}

/**
 * Returns records from the DXNS registry.
 */
// TODO(burdon): Pass in query.
export const useRecords = (): IRecord[] => {
  // TODO(burdon): Mock?
  return [
    {
      id: 'record-1',
      title: 'Record 1',
      type: 'record-1',
      name: 'Record 1'
    },
    {
      id: 'record-2',
      title: 'Record 2',
      type: 'record-2',
      name: 'Record 2'
    },
    {
      id: 'record-3',
      title: 'Record 3',
      type: 'record-3',
      name: 'Record 3'
    }
  ];
};
