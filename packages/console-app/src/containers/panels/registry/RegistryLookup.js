//
// Copyright 2020 DXOS.org
//

import React, { useContext, useState } from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles } from '@material-ui/core';

import { useQuery } from '@apollo/react-hooks';

import Json from '../../../components/Json';

import { ConsoleContext, useQueryStatusReducer, useRegistry } from '../../../hooks';

import WNS_RECORDS from '../../../gql/wns_records.graphql';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1
  },
  select: {
    width: 160,
    marginRight: theme.spacing(2)
  },
  button: {
    marginLeft: theme.spacing(2)
  }
}));

const RegistryLookup = () => {
  const classes = useStyles();
  const { config } = useContext(ConsoleContext);
  const { registry } = useRegistry(config);
  const [result, setResult] = useState({});
  const [inputValue, setInputValue] = useState('');
  const [lookupType, setLookupType] = useState('wrn');

  const data = useQueryStatusReducer(useQuery(WNS_RECORDS, {
    pollInterval: config.api.intervalQuery
  }));

  if (!data) {
    return null;
  }

  const records = JSON.parse(data.wns_records.json);

  const getNames = () => {
    let ret;
    switch (lookupType) {
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

      default:
        throw new Error(`Unrecognized lookup type: ${lookupType}`);
    }

    ret.sort();
    return ret;
  };

  const handleSelect = (evt) => {
    evt.preventDefault();

    // TODO(burdon): Change to controlled component.
    setLookupType(evt.target.value);
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    if (!inputValue) {
      setResult('');
      return;
    }

    let result;
    switch (lookupType) {
      case 'wrn':
        result = await registry.lookupNames([inputValue], true);
        break;

      case 'authority':
        result = await registry.lookupAuthorities([inputValue]);
        break;

      default:
        throw new Error(`Unrecognized lookup type: ${lookupType}`);
    }

    setResult(result);
  };

  return (
    <div className={classes.root}>
      <Toolbar>
        <Select id='lookupType' className={classes.select} name='lookupType' defaultValue='wrn' onChange={handleSelect}>
          <MenuItem value='authority'>Authority</MenuItem>
          <MenuItem value='wrn'>WRN</MenuItem>
        </Select>

        <Autocomplete
          options={getNames()}
          autoFocus
          name='value'
          id='value'
          fullWidth
          freeSolo
          inputValue={inputValue}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
          }}
          renderInput={(params) => <TextField {...params} variant='outlined' />}
        />

        <Button className={classes.button} variant='contained' color='primary' onClick={handleSubmit}>Search</Button>
      </Toolbar>

      <Json data={result} />
    </div>
  );
};

export default RegistryLookup;
