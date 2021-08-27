//
// Copyright 2020 DXOS.org
//

import React, { useState } from 'react';

import { makeStyles, Paper, Toolbar, Typography } from '@material-ui/core';

import { RecordTable, RecordTypeSelector } from '../components';
import { useRecordTypes, useRecords } from '../hooks';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1
  },
  panel: {
    display: 'flex',
    flex: 1
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
  const [recordType, setRecordType] = useState<string>(recordTypes[0].type);
  const records = useRecords({ type: recordType });

  return (
    <Paper className={classes.root}>
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
