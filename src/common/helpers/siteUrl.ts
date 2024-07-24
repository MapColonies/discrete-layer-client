import CONFIG from '../config';

export const currentClient = `${CONFIG.SERVICE_PROTOCOL as string}${
    CONFIG.SERVICE_NAME as string
  }`;

export const currentSite = () => {
    return CONFIG.SITES_CONFIG.slaves.includes(currentClient)? 'slave': 'master';
  };