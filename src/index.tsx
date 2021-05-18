import React from 'react';
import ReactDOM from 'react-dom';
// import 'mobx-react-lite/batchingForReactDom';
import { createHttpClient } from "mst-gql"
import './index.css';
import Axios, { Method } from 'axios';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { StoreProvider, rootStore } from './discrete-layer/models/RootStore';
import { SearchResponse } from './discrete-layer/models/discreteLayersStore';
import CONFIG from './common/config';

/* eslint-disable */
const store = rootStore.create(
  {},
  {
    fetch: async (
      url: string,
      method: Method,
      params: Record<string, unknown>
    ) =>
      Axios.request({
        url,
        method,
        data: params,
        baseURL: `${CONFIG.SERVICE_PROTOCOL as string}${
          CONFIG.SERVICE_NAME as string
        }`,
      }).then((res) => res.data as SearchResponse),
    
    // gqlHttpClient: createHttpClient(`${CONFIG.SERVICE_PROTOCOL as string}${CONFIG.SERVICE_NAME as string}`),
    gqlHttpClient: createHttpClient("http://localhost:8080/graphql")
  }
);

// REMARK IIFE to discard language presentation logic
((): void => {
  const lang = CONFIG.I18N.DEFAULT_LANGUAGE; //navigator.language.split(/[-_]/)[0];  // language without region code

  document.documentElement.lang = lang;
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (lang === 'he') {
    document.body.dir = 'rtl';
  }
})();
ReactDOM.render(
  <React.StrictMode>
    <StoreProvider value={store}>
      <App />
    </StoreProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
/* eslint-enable */
