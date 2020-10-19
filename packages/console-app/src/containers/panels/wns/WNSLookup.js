//
// Copyright 2020 DXOS.org
//

import React, { useContext, useState } from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Button from '@material-ui/core/Button';
import NativeSelect from '@material-ui/core/NativeSelect';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';

import { useQuery } from '@apollo/react-hooks';

import Json from '../../../components/Json';
import Table from '../../../components/Table';
import TableCell from '../../../components/TableCell';
import { ConsoleContext, useQueryStatusReducer, useRegistry } from '../../../hooks';

import WNS_RECORDS from '../../../gql/wns_records.graphql';

const WNSLookup = () => {
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
    <div>
      <form onSubmit={handleSubmit}>
        <TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell align='left' width='150px' style={{ verticalAlign: 'middle' }}>
                  <NativeSelect id='lookupType' name='lookupType' defaultValue='wrn' onChange={handleSelect}>
                    <option value='authority'>Authority</option>
                    <option value='wrn'>WRN</option>
                  </NativeSelect>
                </TableCell>
                <TableCell align='left'>
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
                </TableCell>
                <TableCell align='left' width='150px' style={{ verticalAlign: 'middle' }}>
                  <Button variant='contained' color='primary' type='submit'>Search</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </form>
      <Json data={result} />
    </div>
  );
};

export default WNSLookup;
