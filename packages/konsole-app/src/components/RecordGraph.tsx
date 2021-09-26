//
// Copyright 2021 DXOS.org
//

import React from 'react';

import { IRecord } from '../types';

interface RecordsGraphProps {
  records?: IRecord[]
}

// https://github.com/dxos/gem/blob/main/packages/gem-spore/stories/graph.stories.tsx
export const RecordGraph = ({ records = [] }: RecordsGraphProps) => {
  return (
    <div>
      {records.length}
    </div>
  );
};
