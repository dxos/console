//
// Copyright 2020 DXOS.org
//

import React, { useEffect, useMemo, useState } from 'react';

import { makeStyles, Paper, Toolbar, Typography } from '@material-ui/core';

import { RecordTable, RecordTypeSelector } from '../components';
import { useRecordTypes, useRecords, useRegistryClient } from '../hooks';
import { IRecord, IRecordType } from '../registry';

const useStyles = makeStyles(theme => ({
  panel: {
    margin: theme.spacing(1)
  },
  spacer: {
    flex: 1
  }
}));

/**
 * Display records panel
 * @constructor
 */
export const RecordPanel = () => {
  const classes = useStyles();
  const registryClient = useRegistryClient();
  const [recordType, setRecordType] = useState<string>('');
  const [recordTypes, setRecordTypes] = useState<IRecordType[]>([]);
  const [records, setRecords] = useState<IRecord[]>([]);

  useEffect(() => {
    const fetchRecordTypes = async () => {
      setRecordTypes(await registryClient.getRecordTypes());
    };
    // TODO(marcin): Create subscription to registry client being ready.
    setTimeout(() => fetchRecordTypes(), 2000);
  }, [(registryClient as any).state]);

  useEffect(() => {
    const fetchRecords = async () => {
      setRecords(await registryClient.queryRecords());
    };
    fetchRecords();
  }, [recordTypes]);

  return (
    <Paper>
      <Toolbar variant='dense'>
        <Typography>Records</Typography>
        <div className={classes.spacer} />
        <RecordTypeSelector types={recordTypes} type={recordType} onTypeChange={type => setRecordType(type)} />
      </Toolbar>
      <div className={classes.panel}>
        <RecordTable records={records} />
      </div>
    </Paper>
  );
};
