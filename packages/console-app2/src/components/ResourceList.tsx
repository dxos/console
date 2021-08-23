//
// Copyright 2021 DXOS.org
//

import { useEffect, useState } from 'react';
import { List } from 'semantic-ui-react';
import urlJoin from 'url-join';

import { useChainApi } from '../hooks/chain-api';
import { useChainQuery } from '../hooks/chain-query';

/**
 * Placeholder for All DXNS resources.
 * TODO: Evolve into various tabs.
 */
function ResourceList ({ config }) {
  const chainApi = useChainApi();
  const [error, resources] = useChainQuery(async () => chainApi?.registry.getResources(), [chainApi]);

  const [apps, setApps] = useState([]);
  const [kubes, setKubes] = useState([]);

  useEffect(() => {
    if (resources?.length) {
      setApps(resources.filter(({ messageFqn }) => messageFqn === config.services.dxns.schema.fqn.app));
      setKubes(resources.filter(({ messageFqn }) => messageFqn === config.services.dxns.schema.fqn.KUBE));
    }
  }, [resources]);

  if (error) {
    throw error;
  }

  return (
    <div>
      <h2>Apps</h2>
      <List>
        {(apps ?? []).map(app => {
          const link = urlJoin(config.services.app.server, config.services.app.prefix, `${app.id.domain}:${app.id.resource}`);
          return (<List.Item><a key={app.cid.toString()} href={link}>{link}</a></List.Item>);
        })}
      </List>
      <h2>KUBEs</h2>
      <List>
        {(kubes ?? []).map(kube => <List.Item><a key={kube.cid.toString()} href={kube.data.url}>{kube.data.url}</a></List.Item>)}
      </List>
    </div>
  );
}

export default ResourceList;
