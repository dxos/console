//
// Copyright 2020 DXOS.org
//

import { useQuery } from '@apollo/react-hooks';
import React, { useContext, useState } from 'react';

import { makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

import Json from '../../../components/Json';
import WNS_RECORDS from '../../../gql/wns_records.graphql';
import { ConsoleContext, useQueryStatusReducer, useRegistry } from '../../../hooks';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1
  },
  search: {
    display: 'flex',
    padding: '2px 8px'
  },
  button: {
    marginLeft: theme.spacing(2)
  },
  selected: {
    color: theme.palette.text.primary
  }
}));

const types = [
  { key: 'authority', label: 'Authority' },
  { key: 'wrn', label: 'WRN' }
];

export const LookupType = ({ scope = types[0].key, onChange }) => {
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
          className={t.key === scope && classes.selected}
          onClick={() => onChange(t.key)}
        >
          {t.label}
        </Button>
      ))}
    </ButtonGroup>
  );
};

LookupType.default = types[0].key;

const RegistryLookup = ({ scope }) => {
  const classes = useStyles();
  const { config } = useContext(ConsoleContext);
  const { registry } = useRegistry(config);
  const [result, setResult] = useState({});
  const [inputValue, setInputValue] = useState('');

  const { data } = useQueryStatusReducer(useQuery(WNS_RECORDS, {
    pollInterval: config.api.intervalQuery
  }));

  if (!data) {
    return null;
  }

  const records = JSON.parse(data.wns_records.json);

  const getNames = () => {
    let ret;
    switch (scope) {
      case 'wrn': {
        ret = [];
        records.forEach(item => ret.push(...item.names));
        break;
      }

      case 'authority': {
        // Use the known names to come up with a default list of authorities.
        // TODO(telackey): Should we be able to query WNS for a list of authorities?
        const names = new Set();
        for (const record of records) {
          for (const name of record.names) {
            // TODO(telackey): We need a general purpose WRN handling library.
            names.add(name.replace('wrn://', '').split('/')[0]);
          }
        }
        ret = Array.from(names.values());
        break;
      }
    }

    ret.sort();
    return ret;
  };

  const handleSubmit = async (newInputValue = inputValue) => {
    if (!newInputValue) {
      setResult('');
      return;
    }

    let result;
    switch (scope) {
      case 'wrn':
        result = await registry.lookupNames([newInputValue], true);
        break;

      case 'authority':
        result = await registry.lookupAuthorities([newInputValue]);
        break;
    }

    setResult(result);
  };

  return (
    <div className={classes.root}>
      <div className={classes.search}>
        <Autocomplete
          options={getNames()}
          autoFocus
          id='value'
          name='value'
          fullWidth
          inputValue={inputValue}
          renderInput={(params) => <TextField {...params} variant='outlined' />}
          onInputChange={async (event, newInputValue) => {
            setInputValue(newInputValue);
            await handleSubmit(newInputValue);
          }}
        />
      </div>

      <div>
        <Json data={result} />
      </div>
    </div>
  );
};

export default RegistryLookup;
