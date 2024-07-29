import React from 'react';
import { createRoot } from 'react-dom/client';
// import 'mobx-react-lite/batchingForReactDom';
import { createHttpClient } from 'mst-gql';
import { GraphQLClient } from 'mst-gql/node_modules/graphql-request';
import { request } from 'http';
import Axios, { Method } from 'axios';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { StoreProvider, rootStore } from './discrete-layer/models/RootStore';
import { SearchResponse } from './discrete-layer/models/discreteLayersStore';
import CONFIG from './common/config';
import { sessionStore } from './common/helpers/storage';
import { currentUrl } from './common/helpers/siteUrl';

import './index.css';

export let isEqual: boolean;

export const enum SYNC_QUERY_NAME {
  UPDATE_META_DATA = 'updateMetadata',
  RASTER_INGESTION = 'startRasterIngestion',
  RASTER_UPDATE_GEOPKG = 'startRasterUpdateGeopkg',
  VALIDATE_SOURCE = 'validateSource',
  GET_DIRECTORY = 'getDirectory',
};

type SYNC_QUERY = {
  queryName: string;
  equalCheck: boolean;
  isResponseStore: boolean;
  omitProperties: string[];
};
const syncQueries: SYNC_QUERY[] = [
  {
    queryName: SYNC_QUERY_NAME.UPDATE_META_DATA,
    equalCheck: false,
    isResponseStore: false,
    omitProperties: [],

  },
  {
    queryName: SYNC_QUERY_NAME.RASTER_INGESTION,
    equalCheck: false,
    isResponseStore: false,
    omitProperties: [],

  },
  {
    queryName: SYNC_QUERY_NAME.RASTER_UPDATE_GEOPKG,
    equalCheck: false,
    isResponseStore: false,
    omitProperties: [],

  },
  {
    queryName: SYNC_QUERY_NAME.VALIDATE_SOURCE,
    equalCheck: false,
    isResponseStore: true,
    omitProperties: [],

  },
  {
    queryName: SYNC_QUERY_NAME.GET_DIRECTORY,
    equalCheck: true,
    isResponseStore: false,
    omitProperties: ['modDate', 'id', 'parentId', 'selectable', 'childrenIds'],
  },
];

const BFF_PATH = '/graphql';//'/bff/graphql';

const createLoggingHttpClient = () => {
  const client = createHttpClient(currentUrl);

  const currentQuery = (query: string) => {
    return syncQueries.find((syncQuery: SYNC_QUERY) =>
      query.includes(syncQuery.queryName)
    );
  };

  const slavesDns: GraphQLClient[] = CONFIG.SITES_CONFIG.slaves?.map(
    (slave: { dns: string; isAlias: boolean }) =>
      createHttpClient(slave.dns + BFF_PATH)
  );

  const loggingClient = (url: GraphQLClient) => {
    const request = async (
      isRawRequest: boolean,
      query: string,
      variables: any
    ) => {
      try {
        let masterResponse: any;
        masterResponse = isRawRequest
          ? await url.rawRequest(query, variables)
          : await url.request(query, variables);
        if (currentQuery(query) && !slavesDns.includes(url) /*&& masterResponse.errors.length>0*/) {
          slavesDns.forEach(async (slaveUrl: GraphQLClient) => {
            try {
              let slaveResponse: any = isRawRequest
                ? await slaveUrl.rawRequest(query, variables)
                : await slaveUrl.request(query, variables);
  
              if(currentQuery(query)?.omitProperties?.length as number > 0){
                masterResponse[currentQuery(query)?.queryName as unknown as string].forEach((element:any) => {
                  currentQuery(query)?.omitProperties.forEach((prop: string)=> {
                    delete element[prop]})
                });
                slaveResponse[currentQuery(query)?.queryName as unknown as string].forEach((element:any) => {
                  currentQuery(query)?.omitProperties.forEach((prop: string)=> {
                    delete element[prop]})
                });
              };
              
              if (
                currentQuery(query)?.equalCheck &&
                masterResponse &&
                JSON.stringify(slaveResponse) !== JSON.stringify(masterResponse)
              ) {
                sessionStore.setObject(
                  (currentQuery(query) as SYNC_QUERY).queryName,
                  { equalCheck: 'false', slaveResponse }
                );
              }
              if (currentQuery(query)?.isResponseStore) {
                sessionStore.setObject(
                  (currentQuery(query) as SYNC_QUERY).queryName,
                  slaveResponse
                );
              };
            } catch (error) {
              sessionStore.setObject(
                (currentQuery(query) as SYNC_QUERY).queryName,
                error as Record<string,unknown>);
            };
          });
        };
        return masterResponse;
      } catch (error) {
        console.error(`Error during ${query}: ${JSON.stringify(error)}`);
        throw error;
      };
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
