import './index.css';

import { sp } from '@pnp/sp';
import * as React from 'react';
import { runWithAdal } from 'react-adal';
import * as ReactDOM from 'react-dom';

import adalContext from './adalConfig';
import App2 from './App2';
import registerServiceWorker from './registerServiceWorker';

const DO_NOT_LOGIN = false;

runWithAdal(adalContext.AuthContext, () => {
  adalContext.GetToken()
    .then(token => {
      sp.setup({
        sp: {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      });
      const rootDiv = document.getElementById('root') as HTMLElement;
      ReactDOM.render(<App2 />, rootDiv);
      registerServiceWorker();
    });
}, DO_NOT_LOGIN);