//
// Copyright 2020 DXOS.org
//

// TODO(burdon): Protocol buffer definition?
export interface IRecord {
  id: string
  title: string
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
      title: 'Record 1'
    },
    {
      id: 'record-2',
      title: 'Record 2'
    },
    {
      id: 'record-3',
      title: 'Record 3'
    }
  ];
};
