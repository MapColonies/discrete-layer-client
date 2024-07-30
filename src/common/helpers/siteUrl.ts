import { GraphQLClient } from 'mst-gql/node_modules/graphql-request';
import { createHttpClient } from 'mst-gql';
import CONFIG from '../config';

const BFF_PATH = '/bff/graphql'; //'/graphql';

export const currentUrl = `${CONFIG.SERVICE_PROTOCOL as string}${
  CONFIG.SERVICE_NAME as string
}`;

export const currentSite = () => {
  return CONFIG.SITES_CONFIG.slaves.includes(currentUrl)
    ? 'slave'
    : 'master';
};

export const slavesDns: GraphQLClient[] = CONFIG.SITES_CONFIG.slaves?.map(
  (slave: { dns: string; isAlias: boolean }) =>
    createHttpClient(slave.dns + BFF_PATH)
);
