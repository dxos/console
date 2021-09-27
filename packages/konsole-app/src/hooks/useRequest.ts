//
// Copyright 2021 DXOS.org
//

import debug from 'debug';
import { createContext, useContext, useEffect, useState } from 'react';
import superagent from 'superagent';

const log = debug('dxos:console:request');

export interface IRequest {
  url: string
  params?: any
  method?: string
}

export type ReqeustHandler = (request: IRequest) => Promise<any>;

export const httpRequester = async ({ url, params, method }: IRequest) => {
  // TODO(burdon): Error handling (try/catch).
  const result = await (method === 'POST' ? superagent.post : superagent.get)(url)
    .set('accept', 'json')
    .send(params);

  const { status, body } = result;
  return { status, data: body };
};

export const RequestContext = createContext<[ReqeustHandler, Map<any, any>?]>([httpRequester, new Map()]);

/**
 * HTTP request with optional caching.
 */
export const useRequest = <T>(request: IRequest, cached?: boolean):
  [T | undefined, () => void] => {
  const [requester, cache] = useContext(RequestContext);
  const [time, setTime] = useState(Date.now());
  const [data, setData] = useState<T>();
  const { url, params, method = 'POST' } = request;
  const cacheKey = JSON.stringify(request);

  useEffect(() => {
    let active = true;

    setImmediate(async () => {
      if (cache && cached) {
        const data = cache.get(cacheKey);
        if (data) {
          log(`Cached: ${JSON.stringify(request)}`);
          setData(data);
        }
      }

      log(`Requesting: ${JSON.stringify(request)}`);
      const { status, data } = await requester({ url, params, method });

      // Don't update if unmounted.
      if (active) {
        log('Response:', status);
        setData(data);
        if (cache && cached) {
          cache.set(cacheKey, data);
        }
      }
    });

    return () => {
      active = false;
    };
  }, [time, cacheKey]);

  return [data, () => {
    if (cache && cached) {
      cache.delete(cacheKey);
    }

    setTime(Date.now());
  }];
};
