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

  return result.body;
};

export const RequestContext = createContext<ReqeustHandler>(httpRequester);

/**
 * HTTP request.
 */
export const useRequest = <T>({ url, params, method = 'POST' }: IRequest): [T | undefined, () => void] => {
  const requester = useContext(RequestContext);
  const [time, setTime] = useState(Date.now());
  const [data, setData] = useState<T>();

  useEffect(() => {
    let active = true;

    setData(undefined);
    setImmediate(async () => {
      log(`Requesting: ${JSON.stringify({ url, params, method })}`);
      const data = await requester({ url, params, method });

      // Don't update if unmounted.
      if (active) {
        setData(data);
      }
    });

    return () => { active = false };
  }, [time, url, JSON.stringify(params), method]);

  return [data, () => setTime(Date.now())];
};
