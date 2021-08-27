//
// Copyright 2020 DXOS.org
//

import React, { useState } from 'react';

import { makeStyles, IconButton, Toolbar } from '@material-ui/core';
import { Sync as RefreshIcon } from '@material-ui/icons';

import { RecordTable, RecordTypeSelector } from '../components';
import { useRecordTypes, useRecords } from '../hooks';

const useStyles = makeStyles(() => ({
  panel: {
    display: 'flex',
    flex: 1
  },
  expand: {
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
  const [records, refreshRecords] = useRecords({ type: recordType });

  return (
    <>
      <Toolbar variant='dense'>
        <RecordTypeSelector
          types={recordTypes}
          type={recordType}
          onTypeChange={type => setRecordType(type)}
        />
        <div className={classes.expand} />
        <IconButton size='small' onClick={refreshRecords} >
          <RefreshIcon />
        </IconButton>
      </Toolbar>
      <div className={classes.panel}>
        <RecordTable records={records} />
      </div>
    </>
  );
};
