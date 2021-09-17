//
// Copyright 2021 DXOS.org
//

import debug from 'debug';
import { useState, useEffect } from 'react';
import superagent from 'superagent';

const log = debug('dxos:console:request');

/**
 * HTTP request.
 */
// TODO(burdon): Inject mock server into context.
export const useRequest = <T>(url: string, params: any = {}, post: boolean = true): [T | undefined, () => void] => {
  const [time, setTime] = useState(Date.now());
  const [data, setData] = useState<T>();

  useEffect(() => {
    let active = true;

    log(`Requesting: ${url} [${JSON.stringify(params)}]`);
    setData(undefined);
    setImmediate(async () => {
      // TODO(burdon): Error handling.
      const result = await (post ? superagent.post : superagent.get)(url)
        .set('accept', 'json') // TODO(burdon): Change to POST.
        .send(params);

      // Don't update if unmounted.
      if (active) {
        log(`Success`);
        setData(result.body);
      }
    });

    return () => { active = false };
  }, [time, url, JSON.stringify(params), post]);

  return [data, () => setTime(Date.now())];
};
