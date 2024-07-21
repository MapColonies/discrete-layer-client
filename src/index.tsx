import React from 'react';
import { createRoot } from 'react-dom/client';
// import 'mobx-react-lite/batchingForReactDom';
import { createHttpClient } from 'mst-gql';
import { GraphQLClient } from 'mst-gql/node_modules/graphql-request';
import Axios, { Method } from 'axios';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { StoreProvider, rootStore } from './discrete-layer/models/RootStore';
import { SearchResponse } from './discrete-layer/models/discreteLayersStore';
import CONFIG from './common/config';
import { site } from './discrete-layer/models/userStore';

import './index.css';

const createLoggingHttpClient = () => {
  const SYNC_QUERIES = [
    'mutation updateMetadata',
    'mutation startRasterIngestion',
    'mutation startRasterUpdateGeopkg',
  ];

  const slavesDns: string[] = CONFIG.SITES_CONFIG.slaves?.map(
    (slave: { dns: string; isAlias: boolean }) => slave.dns
  );

  const currentClient = `${CONFIG.SERVICE_PROTOCOL as string}${
    CONFIG.SERVICE_NAME as string
  }`;

  const originalClient = createHttpClient(currentClient);

  let slavesClient: GraphQLClient[]

  if (!slavesDns.includes(currentClient)) {
     slavesClient= CONFIG.SITES_CONFIG.slaves.map(
      (slave: site) => slave.isAlias || createHttpClient(slave.dns)
    );
  }

  // Override the rawRequest method
  const loggingClient = {
    ...originalClient,
    request: (query: string, variables?: any) => {
      const body = JSON.stringify({
        query,
        variables,
      });

      const response = originalClient.request(query, variables);

      if(SYNC_QUERIES.find((syncQuery: string)=>query.includes(syncQuery))){
        response.then(() => {
          slavesClient?.map((slaveClient: GraphQLClient) =>
            slaveClient
              .rawRequest(query, variables)
              .then(({ data, extensions, headers, status, errors }) => {
                return errors;
              })
              .catch(() => {
                console.log(' **** ERROR WHILE executing slaveClient');
              })
          );
          return response;
        });
      };
      
      return response;
    },

    rawRequest: (query: string, variables?: any) => {
      const body = JSON.stringify({
        query,
        variables,
      });

      const response = originalClient.rawRequest(query, variables);
      return response;
    },
    
  };

  return loggingClient;
};

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

    gqlHttpClient: createLoggingHttpClient(),
    // gqlHttpClient: createHttpClient("http://localhost:8080/graphql")
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

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <StoreProvider value={store}>
    {/* Problematic. TODO: Investigate why. */}
    {/* <React.StrictMode> */}
    <App />
    {/* </React.StrictMode> */}
  </StoreProvider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
/* eslint-enable */
