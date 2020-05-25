//
// Copyright 2020 DxOS.org
//

import get from 'lodash.get';
import moment from 'moment';
import React, { useContext, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { makeStyles } from '@material-ui/core';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';

import WNS_RECORDS from '../../../../gql/wns_records.graphql';

import { ConsoleContext, useQueryStatusReducer } from '../../../hooks';

import Table from '../../../components/Table';
import TableCell from '../../../components/TableCell';

import PackageLink from '../../../components/PackageLink';

const types = [
  { key: null, label: 'ALL' },
  { key: 'wrn:xbox', label: 'XBox' },
  { key: 'wrn:resource', label: 'Resource' },
  { key: 'wrn:app', label: 'App' },
  { key: 'wrn:bot', label: 'Bot' },
  { key: 'wrn:type', label: 'Type' },
];

const useStyles = makeStyles(theme => ({
  selected: {
    color: theme.palette.text.primary
  }
}));

export const WNSRecordType = ({ type = types[0].key, onChanged }) => {
  const classes = useStyles();

  return (
    <ButtonGroup
      disableRipple
      disableFocusRipple
      variant="outlined"
      color="primary"
      size="small"
      aria-label="text primary button group"
    >
      {types.map(t => (
        <Button
          key={t.key}
          className={t.key === type && classes.selected}
          onClick={() => onChanged(t.key)}
        >
          {t.label}
        </Button>
      ))}
    </ButtonGroup>
  );
};

const WNSRecords = ({ type }) => {
  const { config } = useContext(ConsoleContext);
  const [{ sort, ascend }, setSort] = useState({ sort: 'type', ascend: true });
  const data = useQueryStatusReducer(useQuery(WNS_RECORDS, {
    pollInterval: config.api.pollInterval,
    variables: { type }
  }));

  if (!data) {
    return null;
  }

  const records = data.wns_records.json;

  // TODO(burdon): Factor out.
  const sortBy = field => () => setSort({ sort: field, ascend: (field === sort ? !ascend : true) });
  const sorter = (item1, item2) => {
    const a = get(item1, sort);
    const b = get(item2, sort);
    const dir = ascend ? 1 : -1;
    return (a < b) ? -1 * dir : (a > b) ? dir : 0;
  };

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell onClick={sortBy('type')} size="small">Type</TableCell>
          <TableCell onClick={sortBy('name')}>Name</TableCell>
          <TableCell onClick={sortBy('version')} size="small">Version</TableCell>
          <TableCell onClick={sortBy('attributes.displayName')}>Description</TableCell>
          <TableCell onClick={sortBy('attributes.package')}>Package Hash</TableCell>
          <TableCell onClick={sortBy('createTime')} size="small">Created</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {records.sort(sorter)
          .map(({ id, type, name, version, createTime, attributes: { displayName, package: pkg } }) => (
            <TableRow key={id} size="small">
              <TableCell monospace>{type}</TableCell>
              <TableCell monospace>{name}</TableCell>
              <TableCell monospace>{version}</TableCell>
              <TableCell>{displayName}</TableCell>
              <TableCell title={JSON.stringify(pkg)} monospace>
                {pkg && (
                  <PackageLink config={config} type={type} pkg={pkg} />
                )}
              </TableCell>
              <TableCell>{moment.utc(createTime).fromNow()}</TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};

export default WNSRecords;
