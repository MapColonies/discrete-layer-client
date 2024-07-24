import CONFIG from '../config';

export const currentClient = `${CONFIG.SERVICE_PROTOCOL as string}${
    CONFIG.SERVICE_NAME as string
  }`;

export const currentClientSite = () => {
    return CONFIG.SITES_CONFIG.masters.includes(currentClient)? 'master': 'slave';
  };