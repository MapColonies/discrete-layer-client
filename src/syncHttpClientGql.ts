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
};

type SYNC_QUERY = {
  queryName: SYNC_QUERY_NAME;
  equalCheck: boolean;
  isResponseStore: boolean;
  omitProperties?: string[];
  sessionStorageMessageCode?: string;
};

const syncQueries: SYNC_QUERY[] = [
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

const isRaster = (variables: any): boolean => {
  return (!variables?.data?.type || variables?.data?.type === RecordType.RECORD_RASTER) &&
         (!variables?.data?.recordType || variables?.data?.recordType === RecordType.RECORD_RASTER);
};

const syncSlaves = (isRawRequest: boolean, masterResponse:any, query: string, variables?: any, relevantQuery?: SYNC_QUERY) => {
  syncSlavesDns.forEach(async (slaveUrl: GraphQLClient) => {
    try {
      let slaveResponse: any = isRawRequest? await slaveUrl.rawRequest(query, variables):
        await slaveUrl.request(query, variables);

      if (relevantQuery?.omitProperties) {
        omitPropertiesFromResponse(masterResponse, relevantQuery);
        omitPropertiesFromResponse(slaveResponse, relevantQuery);
      }

      // For Now: we don't store response from multiple slaves, setObject squash the last value.
      if (relevantQuery?.equalCheck && masterResponse && JSON.stringify(slaveResponse) !== JSON.stringify(masterResponse)) {
        sessionStore.setObject( (relevantQuery as SYNC_QUERY).queryName, relevantQuery?.sessionStorageMessageCode ? { code: relevantQuery?.sessionStorageMessageCode } : slaveResponse );
      }

      if (relevantQuery?.isResponseStore) {
        sessionStore.setObject( (relevantQuery as SYNC_QUERY).queryName, slaveResponse[relevantQuery.queryName] );
      }

    } catch (error) {
      sessionStore.setObject( (relevantQuery as SYNC_QUERY).queryName, { code: 'ingestion.error.not-available', url: `${get(slaveUrl,'url')}`, severity: 'error'/*, error*/ } );
    }
  });
};

export const syncHttpClientGql = () => {
  const clientGql = createHttpClient(currentBffUrl);

  const createClientGql = (url: GraphQLClient) => {
    const syncRequest = async ( isRawRequest: boolean, query: string, variables: any) => {
      try {
        const relevantQuery = currentQuery(query);
        let masterResponse: any = isRawRequest? await url.rawRequest(query, variables):
          await url.request(query, variables);

        if (relevantQuery && !syncSlavesDns.includes(url) && isRaster(variables)) {
          // console.log('*************', relevantQuery.queryName, variables?.data?.type, variables?.data?.recordType)
          syncSlaves(isRawRequest, masterResponse, query, variables, relevantQuery);
        }
        return masterResponse;
      } catch (error) {
        console.error(`Error during ${query}: ${JSON.stringify(error)}`);
        throw error;
      }
    };

    const gqlClientObject = {
      ...url,
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
