//
// Copyright 2020 DXOS.org
//

import get from 'lodash.get';
import { useState } from 'react';

// TODO(burdon): Enable multiple sort order (e.g., id, version).
export const useSorter = (initSort, initAscend = true) => {
  const [{ sort, ascend }, setSort] = useState({ sort: initSort, ascend: initAscend });

  const sorter = (item1, item2) => {
    const a = get(item1, sort);
    const b = get(item2, sort);
    const dir = ascend ? 1 : -1;
    return (a < b) ? -1 * dir : (a > b) ? dir : 0;
  };

  const sortBy = field => () => setSort({ sort: field, ascend: (field === sort ? !ascend : true) });

  return [
    sorter,
    sortBy
  ];
};
