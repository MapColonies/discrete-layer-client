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
import { sessionStore } from './common/helpers/storage';
import { currentClientUrl } from './common/helpers/siteUrl';

import './index.css';
import { request } from 'http';

export let isEqual: boolean;

type SYNC_QUERY = { queryName: string; equalCheck: boolean };
const syncQueries: SYNC_QUERY[] = [
  { queryName: 'mutation updateMetadata', equalCheck: false },
  { queryName: 'mutation startRasterIngestion', equalCheck: false },
  { queryName: 'mutation startRasterUpdateGeopkg', equalCheck: false },
  { queryName: 'query validateSource', equalCheck: false },
  { queryName: 'query getDirectory', equalCheck: true },
];
const BFF_PATH = '/bff/graphql';

const createLoggingHttpClient = () => {

  const client = createHttpClient(currentClientUrl);

  const currentQuery = (query:string) => {
    return syncQueries.find(
    (syncQuery: SYNC_QUERY) => query.includes(syncQuery.queryName)
  );};

  const slavesDns: GraphQLClient[] = CONFIG.SITES_CONFIG.slaves?.map(
    (slave: { dns: string; isAlias: boolean }) => createHttpClient(slave.dns + BFF_PATH)
  );

  let masterResponse: any;

  const loggingClient= (url: GraphQLClient) => {

    const request = async (isRawRequest: boolean, query: string, variables: any) => {
      masterResponse = isRawRequest? await url.rawRequest(query, variables): await url.request(query, variables);
      if(currentQuery(query) && !slavesDns.includes(url)){
          slavesDns.forEach(async (slaveUrl:GraphQLClient)=> {
            const slaveResponse = isRawRequest? await slaveUrl.rawRequest(query, variables): await slaveUrl.request(query, variables);
              if((currentQuery(query) as SYNC_QUERY).equalCheck && masterResponse && slaveResponse !== masterResponse){
                sessionStore.set((currentQuery(query) as SYNC_QUERY).queryName, JSON.stringify({equalCheck: 'false', slaveResponse}));
              };
          });
      };
      return masterResponse;
    };

    const client= {
      ...url,
      request: async (query: string, variables?:any) => {
        return request(false, query, variables);
      },

      rawRequest: async (query: string, variables?: any) => {
        return request(true, query, variables);
      },
    }
    return client;
  };

  return loggingClient(client);
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
