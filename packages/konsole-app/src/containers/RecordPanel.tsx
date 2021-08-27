//
// Copyright 2020 DXOS.org
//

import React, { useEffect, useMemo, useState } from 'react';

import { makeStyles, Paper, Toolbar, Typography } from '@material-ui/core';

import { RecordTable, RecordTypeSelector } from '../components';
import { useRecordTypes, useRecords } from '../hooks';

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
  const recordTypes = useRecordTypes();
  const [recordType, setRecordType] = useState<string>(recordTypes.length > 0 ? recordTypes[0].type : '');
  useEffect(() => {
    console.log('record types: ' + recordTypes.map(x => (x.type)));
    setRecordType(recordTypes.length > 0 ? recordTypes[0].type : '');
  }, [recordTypes]);
  const records = [] as any;// useRecords(undefined);

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
