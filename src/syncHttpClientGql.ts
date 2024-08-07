import { get } from 'lodash';
import { createHttpClient } from 'mst-gql';
import { GraphQLClient } from 'mst-gql/node_modules/graphql-request';
import { currentBffUrl, syncSlavesDns } from './common/helpers/siteUrl';
import { sessionStore } from './common/helpers/storage';
import { RecordType } from './discrete-layer/models';

export const enum SYNC_QUERY_NAME {
  UPDATE_META_DATA = 'updateMetadata',
  RASTER_INGESTION = 'startRasterIngestion',
  RASTER_UPDATE_GEOPKG = 'startRasterUpdateGeopkg',
  VALIDATE_SOURCE = 'validateSource',
  GET_DIRECTORY = 'getDirectory',
  GET_PRODUCT = 'getProduct'
};

export type SYNC_QUERY = {
  queryName: SYNC_QUERY_NAME;
  equalCheck: boolean;
  isResponseStore: boolean;
  omitProperties?: string[];
  pickProperties?: string[];
  sessionStorageMessageCode?: string;
};

export const syncQueries: SYNC_QUERY[] = [
  {
    queryName: SYNC_QUERY_NAME.UPDATE_META_DATA,
    equalCheck: false,
    isResponseStore: false,
  },
  {
    queryName: SYNC_QUERY_NAME.RASTER_INGESTION,
    equalCheck: false,
    isResponseStore: false,
  },
  {
    queryName: SYNC_QUERY_NAME.RASTER_UPDATE_GEOPKG,
    equalCheck: false,
    isResponseStore: false,
  },
  {
    queryName: SYNC_QUERY_NAME.VALIDATE_SOURCE,
    equalCheck: false,
    isResponseStore: true,
  },
  {
    queryName: SYNC_QUERY_NAME.GET_DIRECTORY,
    equalCheck: true,
    isResponseStore: false,
    omitProperties: ['modDate', 'id', 'parentId', 'selectable', 'childrenIds'],
    sessionStorageMessageCode: 'ingestion.error.directory-comparison',
  },
  {
    queryName: SYNC_QUERY_NAME.GET_PRODUCT,
    equalCheck: true,
    isResponseStore: false,
    pickProperties: ['productVersion'],
    sessionStorageMessageCode: 'ingestion.warning.unsynched',
  },
];

const currentQuery = (query: string) => {
  return syncQueries.find((syncQuery: SYNC_QUERY) =>
    query.includes(syncQuery.queryName)
  );
};

const omitPropertiesFromResponse = (
  response: any,
  relevantQuery?: SYNC_QUERY
) => {
  response[relevantQuery?.queryName as unknown as SYNC_QUERY_NAME]
    .forEach((element: any) => {
      relevantQuery?.omitProperties?.forEach(
        (prop: string) => {delete element[prop]}
      )
    });
};

const pickPropertiesFromResponse = (
  response: any,
  relevantQuery?: SYNC_QUERY
) => {
  let partialResponse = {};
  relevantQuery?.pickProperties?.forEach(
    (prop: string) => partialResponse = {...partialResponse, [prop]: response[relevantQuery?.queryName as SYNC_QUERY_NAME][0][prop]}
  );
  return partialResponse;
};

const isRasterRequest = (variables: any): boolean => {
  return (!variables?.data?.type || variables?.data?.type === RecordType.RECORD_RASTER) &&
         (!variables?.data?.recordType || variables?.data?.recordType === RecordType.RECORD_RASTER);
};

const isSameVersion = () => {
  return !sessionStore.getObject(SYNC_QUERY_NAME.GET_PRODUCT);
};

const shouldUpdateSlaves = (queryName: string) => {
  return queryName !== SYNC_QUERY_NAME.RASTER_UPDATE_GEOPKG || isSameVersion();
};

const syncSlaves = (isRawRequest: boolean, masterResponse: any, query: string, variables?: any, relevantQuery?: SYNC_QUERY) => {
  syncSlavesDns.forEach(async (slaveClient: GraphQLClient) => {
    try {
      let slaveResponse: any = isRawRequest? await slaveClient.rawRequest(query, variables):
        await slaveClient.request(query, variables);

      if (relevantQuery?.omitProperties) {
        omitPropertiesFromResponse(masterResponse, relevantQuery);
        omitPropertiesFromResponse(slaveResponse, relevantQuery);
      }

      if (relevantQuery?.pickProperties) {
        masterResponse = pickPropertiesFromResponse(masterResponse, relevantQuery);
        slaveResponse = pickPropertiesFromResponse(slaveResponse, relevantQuery);
      }

      // For Now: we don't store response from multiple slaves, setObject will override with the last value
      if (relevantQuery?.equalCheck && masterResponse && JSON.stringify(slaveResponse) !== JSON.stringify(masterResponse)) {
        sessionStore.setObject( relevantQuery.queryName, relevantQuery?.sessionStorageMessageCode
          ? { code: relevantQuery?.sessionStorageMessageCode }
          : slaveResponse );
      }

      if (relevantQuery?.isResponseStore) {
        sessionStore.setObject( relevantQuery.queryName, slaveResponse[relevantQuery.queryName] );
      }

    } catch (error) {
      sessionStore.setObject( (relevantQuery as SYNC_QUERY).queryName, {
        code: 'ingestion.error.not-available',
        additionalInfo: `${get(slaveClient,'url')}`,
        severity: 'error'
      } );
    }
  });
};

export const syncHttpClientGql = () => {
  const clientGql = createHttpClient(currentBffUrl);

  const createClientGql = (client: GraphQLClient) => {
    const syncRequest = async ( isRawRequest: boolean, query: string, variables: any) => {
      try {
        const relevantQuery = currentQuery(query);
        let masterResponse: any = isRawRequest? await client.rawRequest(query, variables):
          await client.request(query, variables);

        if (relevantQuery && !syncSlavesDns.includes(client) && isRasterRequest(variables) && shouldUpdateSlaves(relevantQuery.queryName)) {
          syncSlaves(isRawRequest, masterResponse, query, variables, relevantQuery);
        }
        return masterResponse;
      } catch (error) {
        console.error(`Error during ${query}: ${JSON.stringify(error)}`);
        throw error;
      }
    };

    const gqlClientObject = {
      ...client,
      request: async (query: string, variables?: any) => {
        return syncRequest(false, query, variables);
      },
      rawRequest: async (query: string, variables?: any) => {
        return syncRequest(true, query, variables);
      },
    };
    return gqlClientObject;
  };

  return createClientGql(clientGql);
};
