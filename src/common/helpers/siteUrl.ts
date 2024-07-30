import { GraphQLClient } from 'mst-gql/node_modules/graphql-request';
import { createHttpClient } from 'mst-gql';
import CONFIG from '../config';
import { site } from '../../discrete-layer/models/userStore';

export const currentBffUrl = `${CONFIG.SERVICE_PROTOCOL as string}${
  CONFIG.SERVICE_NAME as string
}`;

export const currentClientUrl = window.location.origin;

export const currentSite = () => {
  return CONFIG.SITES_CONFIG.slaves
    .map((slave: site) => slave.dns).includes(currentClientUrl)
    ? 'slave'
    : CONFIG.SITES_CONFIG.masters
        .map((master: site) => master.dns).includes(currentClientUrl)
    ? 'master'
    : 'generic';
};

export const syncSlavesDns: GraphQLClient[] = CONFIG.SITES_CONFIG.slaves?.map(
  (slave: site) => !slave.isAlias && createHttpClient(slave.dns + CONFIG.BFF_PATH)
);
