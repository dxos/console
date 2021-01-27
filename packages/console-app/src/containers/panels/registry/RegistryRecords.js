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

import REGISTRY_RECORDS from '../../../gql/registry_records.graphql';

import { ConsoleContext, useQueryStatusReducer, useSorter } from '../../../hooks';

import Table from '../../../components/Table';
import TableCell from '../../../components/TableCell';

import PackageLink from '../../../components/PackageLink';
import QueryLink from '../../../components/QueryLink';
import AppLink from '../../../components/AppLink';

const useStyles = makeStyles(theme => ({
  selected: {
    color: theme.palette.text.primary
  }
}));

const types = [
  { key: null, label: 'ALL' },
  { key: 'dxn:kube', label: 'Kube' },
  { key: 'dxn:service', label: 'Service' },
  { key: 'dxn:app', label: 'App' },
  { key: 'dxn:bot', label: 'Bot' },
  { key: 'dxn:bot-factory', label: 'Bot Factory' },
  { key: 'dxn:file', label: 'File' },
  { key: 'dxn:type', label: 'Type' }
];

export const RecordType = ({ type = types[0].key, onChange }) => {
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
          onClick={() => onChange(t.key)}
        >
          {t.label}
        </Button>
      ))}
    </ButtonGroup>
  );
};

const RegistryRecords = ({ type }) => {
  const { config } = useContext(ConsoleContext);
  const [sorter, sortBy] = useSorter('createTime', false);
  const { data } = useQueryStatusReducer(useQuery(REGISTRY_RECORDS, {
    pollInterval: config.api.intervalQuery,
    variables: { attributes: { type } }
  }));

  if (!data) {
    return null;
  }

  const records = JSON.parse(data.registry_records.json);

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell onClick={sortBy('attributes.type')} size='medium'>Type</TableCell>
          <TableCell onClick={sortBy('names[0]')}>Registered Names</TableCell>
          <TableCell onClick={sortBy('attributes.version')} size='small'>Version</TableCell>
          <TableCell onClick={sortBy('attributes.name')}>Display Name</TableCell>
          <TableCell onClick={sortBy('createTime')} size='small'>Created</TableCell>
          <TableCell onClick={sortBy('attributes.package')}>Package</TableCell>
          <TableCell size='icon' />
        </TableRow>
      </TableHead>
      <TableBody>
        {records.sort(sorter)
          .map((record) => {
            const { id, names, createTime, attributes: { type, name: displayName, fileName, version, description, service, package: pkg } } = record;

            let pkgLink;
            let appLinks;

            if (pkg) {
              pkgLink = (<PackageLink config={config} type={type} pkg={pkg} />);
            }

            if (type === 'dxn:app') {
              appLinks = (
                <>
                  {names.map(dxn =>
                    <div key={dxn}>
                      <AppLink config={config} dxn={dxn} />
                    </div>
                  )}
                </>
              );
            }

            return (
              <TableRow key={id} size='small'>
                <TableCell monospace>{type}</TableCell>
                <TableCell monospace>
                  {appLinks || names.map(name => <div key={name}>{name}</div>)}
                </TableCell>
                <TableCell monospace>
                  {version}
                </TableCell>
                <TableCell>
                  {displayName || service || fileName || description}
                </TableCell>
                <TableCell>
                  {moment.utc(createTime).fromNow()}
                </TableCell>
                <TableCell monospace>
                  {pkgLink}
                </TableCell>
                <TableCell>
                  <QueryLink config={config} id={id} icon />
                </TableCell>
              </TableRow>
            );
          }
          )}
      </TableBody>
    </Table>
  );
};

export default RegistryRecords;
