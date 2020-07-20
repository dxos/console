//
// Copyright 2020 DXOS.org
//

import moment from 'moment';
import React, { useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { makeStyles } from '@material-ui/core';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';

import WNS_RECORDS from '../../../gql/wns_records.graphql';

import { ConsoleContext, useQueryStatusReducer, useSorter } from '../../../hooks';

import Table from '../../../components/Table';
import TableCell from '../../../components/TableCell';

import PackageLink from '../../../components/PackageLink';
import QueryLink from '../../../components/QueryLink';
import AppLink from '../../../components/AppLink';

const types = [
  { key: null, label: 'ALL' },
  { key: 'wrn:kube', label: 'Kube' },
  { key: 'wrn:resource', label: 'Resource' },
  { key: 'wrn:service', label: 'Service' },
  { key: 'wrn:app', label: 'App' },
  { key: 'wrn:bot', label: 'Bot' },
  { key: 'wrn:bot-factory', label: 'Bot Factory' },
  { key: 'wrn:type', label: 'Type' }
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
      variant='outlined'
      color='primary'
      size='small'
      aria-label='text primary button group'
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
  const [sorter, sortBy] = useSorter('createTime', false);
  const data = useQueryStatusReducer(useQuery(WNS_RECORDS, {
    pollInterval: config.api.intervalQuery,
    variables: { attributes: { type } }
  }));

  if (!data) {
    return null;
  }

  const records = JSON.parse(data.wns_records.json);

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell onClick={sortBy('type')} size='medium'>Type</TableCell>
          <TableCell onClick={sortBy('name')}>Identifier</TableCell>
          <TableCell onClick={sortBy('version')} size='small'>Version</TableCell>
          <TableCell onClick={sortBy('attributes.displayName')}>Name</TableCell>
          <TableCell onClick={sortBy('createTime')} size='small'>Created</TableCell>
          <TableCell onClick={sortBy('package')}>Package</TableCell>
          <TableCell size='icon' />
        </TableRow>
      </TableHead>
      <TableBody>
        {records.sort(sorter)
          .map((record) => {
            const { id, type, name, version, createTime, attributes: { displayName, description, service, package: pkg } } = record;

            let pkgLink;
            let appLink;
            let verLink;

            if (pkg) {
              pkgLink = (<PackageLink config={config} type={type} pkg={pkg} />);
            }

            if (type === 'wrn:app') {
              appLink = (<AppLink config={config} name={name} />);
              verLink = (<AppLink config={config} name={name} version={version} text={version} />);
            }

            return (
              <TableRow key={id} size='small'>
                <TableCell monospace>{type}</TableCell>
                <TableCell monospace>
                  {appLink || name}
                </TableCell>
                <TableCell monospace>
                  {verLink || version}
                </TableCell>
                <TableCell>
                  {displayName || service || description}
                </TableCell>
                <TableCell>
                  {moment.utc(createTime).fromNow()}
                </TableCell>
                <TableCell monospace>
                  {pkgLink}
                </TableCell>
                <TableCell>
                  <QueryLink config={config} name={name} icon />
                </TableCell>
              </TableRow>
            );
          }
          )}
      </TableBody>
    </Table>
  );
};

export default WNSRecords;
