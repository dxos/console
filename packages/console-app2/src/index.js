import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import { loadConfig } from './config';

loadConfig().then(config => {
  console.log('>>>>>>>>', config.values);
  ReactDOM.render(<App config={config} />, document.querySelector('#root'));
});
