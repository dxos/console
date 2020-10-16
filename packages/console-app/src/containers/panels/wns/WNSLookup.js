//
// Copyright 2020 DXOS.org
//

import React, { useContext, useState } from 'react';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';

import { ConsoleContext, useRegistry } from '../../../hooks';
import Json from '../../../components/Json';
import Table from '../../../components/Table';
import TableCell from '../../../components/TableCell';

const WNSLookup = () => {
  const { config } = useContext(ConsoleContext);
  const { registry } = useRegistry(config);
  const [result, setResult] = useState({});

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    const formData = new FormData(evt.target);

    const wrn = formData.get('wrn');
    if (wrn) {
      const history = formData.get('wrnhistory') === 'on';
      const result = await registry.lookupNames([wrn], history);
      setResult(result);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell align='left' width='25%'>
                  <label htmlFor='wrn'>WRN</label>
                </TableCell>
                <TableCell align='left'>
                  <input
                    type='text'
                    id='wrn'
                    name='wrn'
                    size={75}
                  />
                  <input
                    type='checkbox'
                    id='wrnhistory'
                    name='wrnhistory'
                  />
                  <label htmlFor='wrnhistory'>History?</label>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <button>Lookup</button>
      </form>
      <Json data={result} />
    </div>
  );
};

export default WNSLookup;
